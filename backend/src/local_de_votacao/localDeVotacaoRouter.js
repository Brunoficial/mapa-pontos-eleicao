import LocalDeVotacaoService from "./localDeVotacaoService.js";
import express from "express";
import dbConnection from "../config/db.js";

const localDeVotacaoRouter = express.Router();

const localDeVotacaoService = new LocalDeVotacaoService(dbConnection);

localDeVotacaoRouter.get(
    "/listar",
    async (req, res) => localDeVotacaoService.listar(req, res)
);

localDeVotacaoRouter.get(
    "/encontrar/:id",
    async (req, res) => localDeVotacaoService.encontrarPorId(req, res)
);

localDeVotacaoRouter.put(
    "/atualizar/:id",
    async (req, res) => localDeVotacaoService.atualizar(req, res)
);

export default localDeVotacaoRouter;
