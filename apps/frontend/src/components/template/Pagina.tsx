import Menu from "@/components/shared/Menu";
import SessaoPrincipal from "@/components/shared/SessaoPrincipal";
import SideMenu from "@/components/shared/SideMenu";

export interface HomeProps {
  children: React.ReactNode;
}

export default function Pagina(props: HomeProps) {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <Menu />

        <div className="flex flex-1 justify-between gap-2 w-full px-4 pb-4">
          <SideMenu />

          <SessaoPrincipal>
            {props.children}
          </SessaoPrincipal>
        </div>
    </div>
  );
}