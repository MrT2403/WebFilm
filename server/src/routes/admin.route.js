import adminController from "../controllers/admin.controller";

router.get("/movies", adminController.getMovies);
router.post("/movies", adminController.createMovie);
router.put("/movies/:id", adminController.updateMovie);
router.delete("/movies/:id", adminController.deleteMovie);

router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/transactions", adminController.getTransactions);
router.get("/transactions/:id", adminController.getTransactionById);
router.delete("/transactions/:id", adminController.deleteTransaction);

router.get("/stats", adminController.getWebsiteStats);

export default router;
