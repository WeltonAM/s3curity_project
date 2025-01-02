import Logo from './Logo'

export default function Carregando() {
    return (
        <div className="h-screen">
            <div
                className="
                flex flex-col justify-center items-center
                absolute top-0 left-0 w-full h-full gap-2
                bg-black/90 text-center
                "
            >
                <Logo width={200} height={200} />
                <span className="font-light text-zinc-500 ml-3">Carregando...</span>
            </div>
        </div>
    )
}