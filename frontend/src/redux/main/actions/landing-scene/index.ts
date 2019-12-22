import Axios from "axios";
import { mainConfig } from "t9/apps/main/config";
import { OpsCB } from "t9/types/fe/template-types";
import { DispatchInterface as DI, MainStoreStateInterface as MSSI } from "t9/types/main/index";
import { actionType } from "../../constants";

export const fetchRecentArticles = (cb?: OpsCB) => ((dispatch: DI, getState: MSSI) => {
  Axios.get(
    mainConfig.app.backendURL + `/{|language code|}/articles/recent.json`,
  ).then((res) => {
    if (res.data) {
      dispatch({ type: actionType.UPDATE_LANDING_SCENE, payload: { recentArticles: res.data } });
    }
    if (cb) { cb(); }
  }).catch((err) => { if (cb) { cb({ message: err }); } });
});
