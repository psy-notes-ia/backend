import UserController from "./controller";

const handler = new UserController();

function UserRouter(router: any, opts: any, done: any) {

  router.get("/", handler.getById);
  // router.get("/sub-allowed", handler.availableSub);
  // router.post("/start-form", handler.addStartFormAnswear);
  done();
}

export default UserRouter;
