export interface SessaoPrincipalProps {
    children: React.ReactNode;
}

export default function SessaoPrincipal(props: SessaoPrincipalProps) {
    return (
        <div className="flex flex-1 bg-zinc-800 w-full rounded-sm p-4">
            {props.children}
        </div>
    );
}