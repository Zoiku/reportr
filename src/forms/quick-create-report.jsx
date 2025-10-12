import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useRef } from "react";
import { createReport } from "@/services/report";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command";
import {
  IconArrowUp,
  IconCircleXFilled,
  IconCurrentLocation,
  IconEye,
  IconEyeOff,
  IconGhost,
  IconGhost3,
  IconGhost3Filled,
  IconMapPin,
  IconPhoto,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function QuickCreateReportForm() {
  const queryClient = useQueryClient();
  const attachmentsInputRef = useRef(null);

  const createReportForm = useForm({
    defaultValues: {
      visibility: "public",
      description: "",
      location: "",
      attachments: [],
    },
  });

  const createReportMutation = useMutation({
    mutationFn: (values) => createReport(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      createReportForm.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <form onSubmit={createReportForm.handleSubmit(createReportMutation.mutate)}>
      <InputGroup className="!bg-background">
        <InputGroupTextarea
          placeholder="Report your issue..."
          autoFocus={true}
          required={true}
          disabled={createReportMutation.isPending}
          minLength={import.meta.env.VITE_REPORT_INPUT_MIN_LENGTH}
          maxLength={import.meta.env.VITE_REPORT_INPUT_MAX_LENGTH}
          {...createReportForm.register("description", {
            required: true,
            minLength: import.meta.env.VITE_REPORT_INPUT_MIN_LENGTH,
            maxLength: import.meta.env.VITE_REPORT_INPUT_MAX_LENGTH,
          })}
        />

        {createReportForm.watch("attachments").length > 0 && (
          <InputGroupAddon align="block-end">
            <div className="size-full grid grid-cols-4 md:grid-cols-5 gap-2">
              {createReportForm
                .watch("attachments")
                .map((attachment, index) => (
                  <div key={index} className="aspect-video relative">
                    <Button
                      className="absolute -top-1 -right-1"
                      size="icon-xs"
                      type="button"
                    >
                      <IconCircleXFilled />
                    </Button>
                    <img
                      className="size-full bg-cover"
                      src={URL.createObjectURL(attachment)}
                      alt={attachment.name}
                    />
                  </div>
                ))}
            </div>
          </InputGroupAddon>
        )}

        <InputGroupAddon align="block-end">
          <Controller
            name="attachments"
            control={createReportForm.control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputGroupButton
                onClick={() => attachmentsInputRef.current.click()}
                variant="outline"
                type="button"
                size="icon-sm"
              >
                <IconPhoto />
                <input
                  className="hidden"
                  name="attachments"
                  type="file"
                  multiple={true}
                  ref={attachmentsInputRef}
                  required={true}
                  onChange={(event) => {
                    field.onChange(Array.from(event.target.files || []));
                  }}
                />
              </InputGroupButton>
            )}
          />

          <Controller
            name="location"
            control={createReportForm.control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <InputGroupButton
                    variant="outline"
                    type="button"
                    size="icon-sm"
                  >
                    <IconMapPin />
                  </InputGroupButton>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput />
                    <CommandList>
                      <CommandGroup></CommandGroup>
                      <CommandSeparator />
                      <CommandGroup>
                        <Button className="w-full" variant="outline">
                          <IconCurrentLocation />
                          Use current location
                        </Button>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />

          <Controller
            name="visibility"
            control={createReportForm.control}
            render={({ field }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton
                    variant="outline"
                    type="button"
                    size="icon-sm"
                  >
                    {createReportForm.watch("visibility") === "public" ? (
                      <IconUserFilled />
                    ) : (
                      <IconGhost3Filled />
                    )}
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>
                    Who can see this report?
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <DropdownMenuRadioItem value="public">
                      <IconUserFilled /> Public
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="private">
                      <IconGhost3Filled /> Private
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />

          <InputGroupText className="ml-auto text-muted-foreground">
            {createReportForm.watch("description").length} /
            {import.meta.env.VITE_REPORT_INPUT_MAX_LENGTH}
          </InputGroupText>

          <InputGroupButton
            variant="default"
            type="submit"
            size="icon-sm"
            disabled={
              !createReportForm.formState.isValid ||
              createReportMutation.isPending
            }
          >
            {createReportMutation.isPending ? <Spinner /> : <IconArrowUp />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
