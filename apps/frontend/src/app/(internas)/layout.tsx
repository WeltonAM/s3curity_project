import ForcarAutenticacao from "@/components/auth/ForcarAutenticacao";
import Pagina from "@/components/template/Pagina";

export default function PaginasInternas({ children }: { children: React.ReactNode }) {
  return (
    <ForcarAutenticacao>
      <Pagina>
        {children}
      </Pagina>
    </ForcarAutenticacao>
  );
}
