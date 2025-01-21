export interface PaginaProps {
  children: React.ReactNode;
}

export default function PaginaAutenticacao(props: PaginaProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        {props.children}
    </div>
  );
}