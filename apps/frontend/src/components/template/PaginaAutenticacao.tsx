import { GoogleOAuthProvider } from "@react-oauth/google";

export interface PaginaProps {
  children: React.ReactNode;
}

export default function PaginaAutenticacao(props: PaginaProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {props.children}
      </div>
    </GoogleOAuthProvider>
  );
}