export interface PaginaProps {
  children: React.ReactNode;
}

export default function Pagina(props: PaginaProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        {props.children}
    </div>
  );
}