"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { PartnerCreateModalProps } from "@/lib/types/components/shared/overlays";
import { usePartnerCreation } from "@/hooks/components/curator/create/use-partner-creation";
import { AnimatedModalShell } from "@/components/overlays/shared/animated-modal-shell";
import { ModalPanelHeader } from "@/components/overlays/shared/modal-panel-header";
import { PartnerCreateForm } from "@/components/curator/create/partner-create-modal/partner-create-form";

const PartnerCreateModal = ({
  isOpen,
  onClose,
  onPartnerCreated,
}: PartnerCreateModalProps) => {
  const {
    name,
    setName,
    nickname,
    setNickname,
    slogan,
    setSlogan,
    logo,
    fileInputRef,
    createPartnerMutation,
    handlePickLogo,
    handleFileChange,
    handleSubmit,
  } = usePartnerCreation({ onPartnerCreated, onClose });

  return (
    <AnimatedModalShell isOpen={isOpen} onClose={onClose}>
      <ModalPanelHeader
        title="New Partner"
        subtitle="Add a new partner organization"
        onClose={onClose}
      />

      <PartnerCreateForm
        name={name}
        setName={setName}
        nickname={nickname}
        setNickname={setNickname}
        slogan={slogan}
        setSlogan={setSlogan}
        logo={logo}
        fileInputRef={fileInputRef}
        onPickLogo={handlePickLogo}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />

      <div className="border-border bg-muted/30 flex justify-end gap-3 border-t px-8 py-6">
        <Button
          type="button"
          onClick={onClose}
          variant="ghost"
          className="px-6"
        >
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          form="partner-form"
          loading={createPartnerMutation.isPending}
          loadingText="Creating..."
          disabled={!name.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 px-8 font-semibold shadow-lg disabled:opacity-50 disabled:shadow-none"
        >
          Create Partner
        </LoadingButton>
      </div>
    </AnimatedModalShell>
  );
};

export default PartnerCreateModal;
