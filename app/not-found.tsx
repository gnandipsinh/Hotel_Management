import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { ErrorState } from "@/components/states/error-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer width="narrow" className="flex min-h-[70vh] flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <ErrorState kind="not-found" />
        <Button type="button" variant="outline" size="sm" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
