import { useContext } from "react"
import ContextoMensagem from "../contexts/ContextoMensagem"

const useMensagem = () => useContext(ContextoMensagem)
export default useMensagem