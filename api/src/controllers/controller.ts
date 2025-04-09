import { Router } from "express";

abstract class Controller {
    protected router: Router;

    constructor(router: Router) {
        this.router = router;
        this.init();
    }

    protected abstract init(): void;
}

export default Controller;