import Login from "../model/Login";

export default interface RepositorioLogin {
  registrar(login: Login): Promise<void>;
}
