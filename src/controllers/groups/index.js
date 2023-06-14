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
    const result = await db("groups")
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
        db.raw(
          "CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"
        ),
        db.raw(
          "CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent_teacher"
        )
      );

    res.status(201).json({
      groups: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const showGroups = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db("groups")
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
        db.raw(
          "CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"
        ),
        db.raw(
          "CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent_teacher"
        )
      )
      .where({ "groups.id": id });

    res.status(201).json({
      groups: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

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
const postGoupsStudents = async (req, res) => {
  try {
    const { student_id, group_id } = req.body;

    const existing = await db("groups_students")
      .where({ student_id: student_id })
      .orWhere({ group_id: group_id });
    if (existing) {
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

const getGroupsStudents = async (req, res) => {
  try {
    const { id, student_id } = req.body;
    // const result = await db("groups_students gs")
    //   .leftJoin("students s", "s.id", "gs.student_id")
    //   .leftJoin("groups g", "g.id", "gs.group_id")
    //   .select("g.id","g.name", db.raw("CONCAT(s.first_name, ' ', s.last_name"));
    const result = await db("groups_students as gs")
    .leftJoin("students as s", "s.id", "gs.student_id")
    .leftJoin("groups as g", "g.id", "gs.group_id")
    .select("g.id", "g.name", db.raw("CONCAT(s.first_name, ' ', s.last_name) as full_name"))
    res.status(200).json(result);
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
  postGoupsStudents,
  getGroupsStudents,
};
