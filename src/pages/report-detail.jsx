import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getReport } from "@/services/report";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ReportCardHeader } from "@/pages/home";
import { IconArrowNarrowLeft } from "@tabler/icons-react";

function ReportDetailSection({
  title,
  description,
  className,
  children,
  ...rest
}) {
  return (
    <div className={cn("space-y-6", className)} {...rest}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <div className="font-medium">{title}</div>}
          {description && (
            <div className="text-muted-foreground text-sm">{description}</div>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default function ReportDetail() {
  const params = useParams();
  if (!params.id) return;

  const navigate = useNavigate();

  const {
    data: report,
    isError: isReportError,
    isLoading: isReportLoading,
  } = useQuery({
    queryKey: ["reports", params.id],
    queryFn: () => getReport(params.id),
  });

  return isReportLoading ? (
    <div className="h-screen grid place-content-center">
      <Spinner />
    </div>
  ) : !isReportError ? (
    report ? (
      <div className="*:border-b *:p-4 *:md:p-6">
        <ReportDetailSection>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <IconArrowNarrowLeft className="text-primary" /> Reports
          </Button>
        </ReportDetailSection>

        <ReportDetailSection>
          <ReportCardHeader report={report} />
        </ReportDetailSection>

        <ReportDetailSection title="Responding Team"></ReportDetailSection>
        <ReportDetailSection title="Activity Timeline"></ReportDetailSection>
        <ReportDetailSection title="Evidence Gallery"></ReportDetailSection>
        <ReportDetailSection title="Action Center"></ReportDetailSection>
      </div>
    ) : (
      <div className="h-screen grid place-content-center">Empty</div>
    )
  ) : (
    <div className="h-screen grid place-content-center">Error</div>
  );
}
