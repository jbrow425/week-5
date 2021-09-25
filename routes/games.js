const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - title
 *         - genre
 *       properties:
 *         id:
 *           type: string
 *           description: The AUTO-GENERATED ID of the video game
 *         title:
 *           type: string
 *           description: The game title
 *         genre:
 *           type: string
 *           description: The game genre
 *       example:
 *         id: dOBY0kFa
 *         title: Batman
 *         genre: Adventure
 */

 /**
  * @swagger
  * tags:
  *   name: Video Games
  *   description: The video games managing API
  */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Returns the list of all the video games
 *     tags: [Video Games]
 *     responses:
 *       200:
 *         description: The list of the games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */

router.get("/", (req, res) => {
	const games = req.app.db.get("games");

	res.send(games);
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get the video game by id
 *     tags: [Video Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game id
 *     responses:
 *       200:
 *         description: The game description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: The game was not found
 */

router.get("/:id", (req, res) => {
  const game = req.app.db.get("games").find({ id: req.params.id }).value();

  if(!game){
    res.sendStatus(404)
  }

	res.send(game);
});

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new video game ERASE THE ID FIELD BEFORE YOU CREATE
 *     tags: [Video Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: The video game was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       500:
 *         description: Server error
 */

router.post("/", (req, res) => {
	try {
		const game = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.db.get("games").push(game).write();
    
    res.send(game)
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /games/{id}:
 *  put:
 *    summary: Update the video game by the id
 *    tags: [Video Games]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The video game id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Game'
 *    responses:
 *      200:
 *        description: The video game was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Game'
 *      404:
 *        description: The video game was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("games")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("games").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Remove the video game by id
 *     tags: [Video Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The video game id
 * 
 *     responses:
 *       200:
 *         description: The video game was deleted
 *       404:
 *         description: The video game was not found
 */

router.delete("/:id", (req, res) => {
	req.app.db.get("games").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;