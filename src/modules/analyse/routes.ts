
import CheckAnalyseStatus from "./check-analyse-status";
import CreateAnalyse from "./generate-analyse";
import FecthAllAnalyses from "./get-all-analyses";


function AnalyseRouter(fastify: any, opts: any, done: any) {
  fastify.post("/analyse/", CreateAnalyse);
  fastify.get("/analyse/:id/:status", CheckAnalyseStatus);
  fastify.get("/analyse/:pacientId", FecthAllAnalyses);

  done();
}

export default AnalyseRouter;
