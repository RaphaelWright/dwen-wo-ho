"use client";

import { ResponsiveDialog } from "../ui/responsive-dialog";
import Image from "next/image";
import { WAITLIST_CONTENT } from "@/lib/constants/components/modals/waitlist";
import { useWaitlistForm } from "@/hooks/components/modals/use-waitlist";
import { WaitlistModalProps } from "@/lib/types/modals";
import { Input } from "../ui/input";
import { LoadingButton } from "@/components/ui/loading-button";

const WaitListModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const { formData, handleInputChange, loading, success, handleSubmit } =
    useWaitlistForm(() => onClose());

  const { TITLE, SUBTITLE, IMAGE, FORM, BRAND, FIELDS } = WAITLIST_CONTENT;

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={(val: boolean) => !val && onClose()}
    >
      <div className="max-w-5xl mx-auto p-4 md:p-8 overflow-y-auto relative">
        <div className="absolute top-2 md:top-5 right-5 md:right-0 ">
          <div className="flex items-center gap-2">
            <p className="flex items-center gap-2 w-max text-foreground font-bold text-lg">
              <span className="text-2xl">{BRAND.SYMBOL}</span> {BRAND.NAME}
            </p>
          </div>
        </div>
        <div className="flex items-center pt-10 justify-between mb-2">
          <div />
          <p className="text-xl md:text-3xl font-bold text-teal-600 text-center w-full block">
            {TITLE}
          </p>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-center mb-6 mt-2">
          {SUBTITLE}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="shrink-0 col-span-2 w-full h-full min-h-100">
            <Image
              src={IMAGE.SRC}
              alt={IMAGE.ALT}
              className="rounded-xl w-full h-full object-cover"
              width={1000}
              height={1000}
            />
          </div>
          <form
            className="flex-1 w-full flex flex-col justify-between gap-4 col-span-3"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4">
              {FIELDS.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="border border-input rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    required={field.required}
                  />
                  {field.helperText && (
                    <div className="text-foreground text-base font-medium">
                      {field.helperText}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <LoadingButton
                type="submit"
                loading={loading}
                loadingText={FORM.LOADING_BUTTON}
                disabled={
                  !formData.fullName ||
                  !formData.whatsappNumber ||
                  !formData.email
                }
                className="bg-success text-success-foreground text-2xl font-bold rounded px-6 py-2 disabled:opacity-50"
              >
                {FORM.SUBMIT_BUTTON}
              </LoadingButton>
            </div>
            {success && (
              <div className="text-success font-bold text-center">
                {WAITLIST_CONTENT.MESSAGES.SUCCESS}
              </div>
            )}
          </form>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default WaitListModal;
