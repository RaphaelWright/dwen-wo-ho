"use client";

import { useRef, useState } from "react";
import {
  useCreatePartner,
  ICreatePartner,
} from "@/hooks/queries/usePartnersQuery";

interface UsePartnerCreationProps {
  onPartnerCreated?: (data: {
    name: string;
    nickname?: string;
    logo?: string;
  }) => void;
  onClose: () => void;
}

export const usePartnerCreation = ({
  onPartnerCreated,
  onClose,
}: UsePartnerCreationProps) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [slogan, setSlogan] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createPartnerMutation = useCreatePartner();

  const handlePickLogo = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const partnerData: ICreatePartner = {
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      slogan: slogan.trim() || undefined,
      logo: logoFile,
    };

    createPartnerMutation.mutate(partnerData, {
      onSuccess: (data) => {
        onPartnerCreated?.({
          name: data.name,
          nickname: data.nickname,
          logo: data.logo,
        });
        // Reset form
        setName("");
        setNickname("");
        setSlogan("");
        setLogo(undefined);
        setLogoFile(null);
        onClose();
      },
    });
  };

  return {
    name,
    setName,
    nickname,
    setNickname,
    slogan,
    setSlogan,
    logo,
    logoFile,
    fileInputRef,
    createPartnerMutation,
    handlePickLogo,
    handleFileChange,
    handleSubmit,
  };
};
