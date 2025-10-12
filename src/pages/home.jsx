import QuickCreateReportForm from "@/forms/quick-create-report";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn, share, toDateFromTimestamp } from "@/lib/utils";
import { getReports } from "@/services/report";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as timeago from "timeago.js";
import {
  IconBrandSupabase,
  IconCircleCheckFilled,
  IconCirclesFilled,
  IconCircleXFilled,
  IconRoute,
  IconShare,
  IconThumbUp,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { reup, support, track } from "@/services/interactions";
import { toast } from "sonner";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";

function ReportStatusBadge({ status }) {
  const badgeIconMap = {
    received: (
      <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
    ),
    review: (
      <IconCirclesFilled className="fill-amber-500 dark:fill-amber-400" />
    ),
    closed: <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />,
  };

  return (
    <Badge variant="outline">
      {badgeIconMap[status] && badgeIconMap[status]}
      <span className="font-bold capitalize">{status}</span>
    </Badge>
  );
}

export function ReportCardHeader({ report }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="space-x-4 text-sm">
          <span>{report.reportedBy.displayName}</span>
          <span className="text-muted-foreground">
            {timeago.format(toDateFromTimestamp(report.createdAt))}
          </span>
        </div>
        <ReportStatusBadge status={report.status} />
      </div>
      <div className="text-muted-foreground text-sm">{report.location}</div>
      <div className="inline-flex gap-2 flex-wrap">
        {report.categories.map((category, index) => (
          <Badge key={index} className="font-bold" variant="secondary">
            {category}
          </Badge>
        ))}
      </div>
      <div>{report.description}</div>
    </div>
  );
}

function ReportActionButton({
  popOverContent,
  onClick,
  isLoading,
  children,
  ...rest
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isLoading}
          onClick={(event) => {
            if (!!event) event.stopPropagation();
            if (onClick && onClick instanceof Function) onClick();
          }}
          {...rest}
        >
          {isLoading ? <Spinner /> : children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{popOverContent}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ReportFeedCard({ report }) {
  const supportMutation = useMutation({
    mutationFn: () => support(report.reportedBy.id, report.id),
    onSuccess: () => {
      toast.success("Supported");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const reupMutation = useMutation({
    mutationFn: () => reup(report.reportedBy.id, report.id),
    onSuccess: () => {
      toast.success("Re-upped");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const trackMutation = useMutation({
    mutationFn: () => track(report.reportedBy.id, report.id),
    onSuccess: () => {
      toast.success("Tracked");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const navigate = useNavigate();
  return (
    <div
      className="border-b space-y-2"
      onClick={() => navigate(`/report/status/${report.id}`)}
    >
      <ReportCardHeader report={report} />
      {report.attachments && Array.isArray(report.attachments) && (
        <div
          className={cn(
            "grid gap-2",
            report.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {report.attachments.slice(0, 4).map(
            (attachment, index) =>
              !!attachment && (
                <div
                  key={index}
                  className={cn(
                    "overflow-clip",
                    report.attachments.length > 1 ? "h-24 md:h-40" : "size-full"
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <ImageZoom zoomMargin={100}>
                    <img
                      className="size-full"
                      src={attachment.secure_url}
                      alt={attachment.display_name}
                    />
                  </ImageZoom>
                </div>
              )
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReportActionButton
            popOverContent="Re-up"
            onClick={reupMutation.mutate}
            isLoading={reupMutation.isPending}
          >
            <IconBrandSupabase />
          </ReportActionButton>
          <ReportActionButton
            popOverContent="Support"
            onClick={supportMutation.mutate}
            isLoading={supportMutation.isPending}
          >
            <IconThumbUp />
          </ReportActionButton>
          <ReportActionButton
            popOverContent="Track"
            onClick={trackMutation.mutate}
            isLoading={trackMutation.isPending}
          >
            <IconRoute />
          </ReportActionButton>
        </div>

        <div className="flex items-center gap-2">
          <ReportActionButton
            popOverContent="Share"
            onClick={() => share({ text: report.description })}
          >
            <IconShare />
          </ReportActionButton>
        </div>
      </div>
    </div>
  );
}

function ReportFeed({ isLoading, isError, reports }) {
  return isLoading ? (
    <div className="grid place-content-center h-screen">
      <Spinner />
    </div>
  ) : !isError ? (
    reports ? (
      reports.length > 0 ? (
        <div className="*:p-4 *:md:p-6">
          {reports.map((report) => (
            <ReportFeedCard key={report.id} report={report} />
          ))}
          <div className="h-40" />
        </div>
      ) : (
        <div className="grid place-content-center h-screen">Empty</div>
      )
    ) : (
      <>Error</>
    )
  ) : (
    <div className="grid place-content-center h-screen">Error</div>
  );
}

export default function Home() {
  const {
    data: reports,
    isLoading: isReportsLoading,
    isError: isReportsError,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  return (
    <div>
      <ReportFeed
        isLoading={isReportsLoading}
        isError={isReportsError}
        reports={reports}
      />

      <div className="w-[90%] md:w-lg fixed bottom-5 left-1/2 -translate-x-1/2">
        <QuickCreateReportForm />
      </div>
    </div>
  );
}
