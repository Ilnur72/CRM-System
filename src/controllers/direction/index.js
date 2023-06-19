const express = require("express");
const db = require("../../db");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

const postDirections = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await db("direction").where({ name: name });
    if (existing) {
      return res.status(404).json({ message: "Bu yo'nalish oldindan mavjud." });
    }

    const direction = await db("direction").insert({ name }).returning("*");
    res.status(201).json({ direction: direction[0] });
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
const getDirections = async (req, res) => {
  try {
    const {
      q,
      offset = 1,
      limit = 5,
      sort_by = "id",
      sort_order = "desc",
    } = req.query;
    const dbQuery = db("direction").select("*");

    if (q) {
      dbQuery.andWhereILike("name", `%${q}%`);
    }

    const total = dbQuery.clone().count().groupBy("id");
    dbQuery
      .orderBy(sort_by, sort_order)
      .limit(limit)
      .offset((offset - 1) * limit);

    const direction = await dbQuery;
    res.status(200).json({
      direction,
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

const showDirections = async (req, res) => {
  try {
    const { id } = req.params;
    const direction = await db("direction").where({ id }).select("*");
    if (!direction) {
      res.status(404).json({ message: "Bu yo'nalish mavjud emas." });
    }
    res.status(200).json(direction);
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
const patchDirections = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const existing = await db("directions").where({ id });
    if (!existing) {
      res.status(404).json({ message: "Bu yo'nalish mavjud emas." });
    }

    const updated = await db("directions")
      .where({ id })
      .updated({ name })
      .returning("*");

    res.status(200).json({ updated: updated[0] });
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
const deleteDirection = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db("direction").where({ id });
    if (!existing) {
      return res.status(404).json({ message: "Bu yo'nalish mavjud emas." });
    }

    const deleted = await db("direction").where({ id }).delete().returning("*");
    res.status(200).json({ deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  postDirections,
  getDirections,
  patchDirections,
  deleteDirection,
  showDirections,
};
