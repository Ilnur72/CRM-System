const express = require("express");
const db = require("../../db");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postGroup = async (req, res) => {
  try {
    const { name, teacher_id, assistent_teacher_id } = req.body;

    if (teacher_id) {
      const existing = await db("stuff").where({ id: teacher_id }).first();

      if (!existing || existing.role !== "teacher") {
        return res.status(400).json({
          error: "Teacher mavjud emas.",
        });
      }
    }

    if (assistent_teacher_id) {
      const existing = await db("stuff")
        .where({ id: assistent_teacher_id })
        .first();

      if (!existing || existing.role !== "assistent_teacher") {
        return res.status(400).json({
          error: "Asistent teacher mavjud emas.",
        });
      }
    }

    const result = await db("groups")
      .insert({ name, teacher_id, assistent_teacher_id })
      .returning("*");

    res.status(201).json({
      group: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getGroups = async (req, res) => {
  try {
    const {
      q,
      offset = 1,
      limit = 5,
      sort_by = "id",
      sort_order = "desc",
      direction_id,
    } = req.query;

    const dbQuery = db("groups")
      .leftJoin(
        "stuff as stuff_teacher",
        "stuff_teacher.id",
        "groups.teacher_id"
      )
      .leftJoin(
        "stuff as stuff_assistent ",
        "stuff_assistent.id",
        "groups.assistent_teacher_id"
      )
      .select(
        "groups.id",
        "groups.name",
        "groups.direction_id",
        db.raw(
          "CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"
        ),
        db.raw(
          "CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent_teacher"
        )
      );

    if (direction_id) {
      dbQuery.where({direction_id});
    }
    if (q) {
      dbQuery.andWhereILike("groups.name", `%${q}%`);
    }

    const total = dbQuery.clone().count().groupBy("id");
    dbQuery
      .orderBy(sort_by, sort_order)
      .limit(limit)
      .offset((offset - 1) * limit);

    const groups = await dbQuery;

    res.status(200).json({
      groups,
      pageInfo: {
        total: total.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const showGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const dbQuery = await db("groups")
      .leftJoin(
        "stuff as stuff_teacher",
        "stuff_teacher.id",
        "groups.teacher_id"
      )
      .leftJoin(
        "stuff as stuff_assistent ",
        "stuff_assistent.id",
        "groups.assistent_teacher_id"
      )
      .leftJoin('direction', 'groups.direction_id', 'direction.id')
      .innerJoin("groups_students", "groups_students.group_id", "groups.id")
      .innerJoin("students", "groups_students.student_id", "students.id")
      .select(
        "groups.id",
        "groups.name",
        "direction.name",
        "stuff_teacher.id as teacher_id",
        db.raw(
          "CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"
        ),
        "stuff_assistent.id as assistent_id",
        db.raw(
          "CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent_teacher"
        ),
        db.raw(
          `json_agg(json_build_object(
            'id', students.id,
            'first_name', students.first_name, 
            'last_name', students.last_name
          )) as students`
        )
      )
      .where({ "groups.id": id })
      .groupBy("groups.id", "stuff_teacher.id", "stuff_assistent.id", "direction.id")
      .first();
    const group = await dbQuery;
    if (!group) {
      return res.status(404).json({
        error: "Group not found",
      });
    }

    res.status(200).json({
      group,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const updateGroups = async (req, res) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await db("groups").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli xodim topilmadi.`,
      });
    }

    const updated = await db("groups")
      .where({ id })
      .update({ ...changes })
      .returning(["id", "name", "teacher_id", "assistent_teacher_id"]);

    res.status(200).json({
      groups: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db("groups").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli guruh topilmadi.`,
      });
    }

    const deleted = await db("groups")
      .where({ id })
      .delete()
      .returning(["id", "name", "teacher_id"]);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//groups_students uchun api
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const addStudent = async (req, res) => {
  try {
    const { id: group_id, student_id } = req.params;

    const existing = await db("groups_students")
      .where({ student_id: student_id })
      .andWhere({ group_id: group_id });
    if (existing.length) {
      return res.status(400).json({ message: "Bu student guruhda mavjud" });
    }

    const result = await db("groups_students")
      .insert({ student_id, group_id })
      .returning("*");
    res.status(201).json({ groups_students: result[0] });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// const getStudentsGroup = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await db("groups_students as gs")
//       .leftJoin("students as s", "s.id", "gs.student_id")
//       .leftJoin("groups as g", "g.id", "gs.group_id")
//       .select(
//         "g.id as group_id",
//         "s.id as student_id",
//         "g.name as group_name",
//         db.raw("CONCAT(s.first_name, ' ', s.last_name) as full_name")
//       )
//       .where("g.id", id);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const removeStudent = async (req, res) => {
  try {
    const { id, student_id } = req.params;
    const existing = await db("groups_students")
      .where({ group_id: id })
      .orWhere({ student_id: student_id })
      .first();
    if (!existing) {
      return res.status(404).json({ message: `${id} idli student topilmadi.` });
    }

    const deleted = await db("groups_students")
      .where({ group_id: id })
      .andWhere({ student_id: student_id })
      .delete()
      .returning("*");
    res.status(200).json({ deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  postGroup,
  getGroups,
  showGroups,
  updateGroups,
  deleteGroups,
  addStudent,
  removeStudent
};
