import ForcarAutenticacao from "@/components/auth/ForcarAutenticacao";

export default function PaginasInternas({children}: {children: React.ReactNode}) {
  return (
    <ForcarAutenticacao>
        {children}
    </ForcarAutenticacao>
  );
}
