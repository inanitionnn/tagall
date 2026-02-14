import Link from "next/link";
import { Header, Paragraph, Button } from "../_components/ui";
import { Container } from "../_components/shared";
import { ShieldX } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <ShieldX className="h-24 w-24 text-destructive" />
        <Header vtag="h1">Access Denied</Header>
        <Paragraph className="text-muted-foreground">
          Sorry, you don&apos;t have permission to access this application.
          Login is restricted to authorized users only.
        </Paragraph>
        <Paragraph className="text-sm text-muted-foreground">
          If you believe this is an error, please contact the administrator.
        </Paragraph>
        <Link href="/">
          <Button size="lg">Return to Home</Button>
        </Link>
      </div>
    </Container>
  );
}
