import Image from "next/image";

export interface LogoProps {
    width?: number;
    height?: number;
}

export default function Logo(props: LogoProps) {
    return (
        <div>
            <Image 
                src="/logo.png" 
                alt="Logo" 
                width={props.width || 100} height={props.height || 100}  
            />
        </div>
    );
}