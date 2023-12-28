import { observable, action } from "mobx";
import http from "@/http";

class RootStore {
    @observable state = {
        gs_title: "",
        showLoading: false
    };

    @action
    setGsTitle = str => {
        this.state.gs_title = str;
    };

    @action
    setLoading = str => {
        this.state.showLoading = str;
    };
}

export default new RootStore();
