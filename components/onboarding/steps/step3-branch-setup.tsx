"use client";

import * as React from "react";
import {
  Edit2Icon,
  GitBranchIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UseOnboardingReturn } from "@/lib/onboarding/use-onboarding";
import type { OnboardingBranch } from "@/types/onboarding";

interface Step3Props {
  onboarding: UseOnboardingReturn;
}

const EMPTY_BRANCH: Omit<OnboardingBranch, "id"> = {
  name: "",
  code: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  phone: "",
  email: "",
  managerName: "",
  isPrimary: false,
};

export function Step3BranchSetup({ onboarding }: Step3Props) {
  const {
    state,
    errors,
    addBranch,
    updateBranch,
    removeBranch,
    setPrimaryBranch,
  } = onboarding;
  const { branches } = state;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingBranchId, setEditingBranchId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Omit<OnboardingBranch, "id">>(EMPTY_BRANCH);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingBranchId(null);
    setFormData({
      ...EMPTY_BRANCH,
      isPrimary: branches.length === 0,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleOpenEdit = (branch: OnboardingBranch) => {
    setEditingBranchId(branch.id);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      postalCode: branch.postalCode,
      phone: branch.phone,
      email: branch.email,
      managerName: branch.managerName,
      isPrimary: branch.isPrimary,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleSaveDialog = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Branch name is required";
    if (!formData.code.trim()) {
      errs.code = "Branch code is required";
    } else {
      const codeUpper = formData.code.trim().toUpperCase();
      const duplicate = branches.some(
        (b) => b.id !== editingBranchId && b.code.toUpperCase() === codeUpper,
      );
      if (duplicate) errs.code = `Branch code "${codeUpper}" is already in use`;
    }
    if (!formData.city.trim()) errs.city = "City is required";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (editingBranchId) {
      updateBranch(editingBranchId, {
        ...formData,
        code: formData.code.toUpperCase(),
      });
    } else {
      const newId = `branch-${Date.now()}`;
      addBranch({
        ...formData,
        id: newId,
        code: formData.code.toUpperCase(),
      });
    }
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
          <GitBranchIcon className="size-4" aria-hidden="true" />
          <span>Step 3 · Topology & Branches</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Branch & Property Setup
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your primary hotel property and any additional regional branches, resorts, or wings managed under your account.
        </p>
      </div>

      {/* Branch List Card */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Configured Properties & Branches</h3>
              <Badge variant="secondary" className="text-xs">
                {branches.length} {branches.length === 1 ? "Branch" : "Branches"}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Each branch operates with independent rooms, staff rosters, and inventory while rolling up to your main dashboard.
            </p>
          </div>
          <Button type="button" onClick={handleOpenAdd} size="sm">
            <PlusIcon className="size-4" />
            Add Another Branch
          </Button>
        </div>

        {errors.branches && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {errors.branches}
          </div>
        )}
        {errors.primary && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {errors.primary}
          </div>
        )}

        {/* Branch Cards */}
        <div className="mt-6 flex flex-col gap-4">
          {branches.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed p-8 text-center">
              <GitBranchIcon className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">Add your first branch</p>
              <p className="text-xs text-muted-foreground">Configure the main property for your hotel</p>
              <Button type="button" size="sm" onClick={handleOpenAdd} className="mt-4">
                Add Primary Branch
              </Button>
            </div>
          ) : (
            branches.map((branch) => (
              <div
                key={branch.id}
                className={`relative flex flex-col justify-between gap-4 rounded-xl border p-5 transition-colors sm:flex-row sm:items-center ${
                  branch.isPrimary
                    ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
                    : "bg-card hover:border-muted-foreground/30"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-semibold text-foreground sm:text-base">
                      {branch.name}
                    </span>
                    <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-wider">
                      {branch.code}
                    </Badge>
                    {branch.isPrimary && (
                      <Badge className="bg-primary text-primary-foreground text-[10px]">
                        <StarIcon className="mr-1 size-3 fill-current" /> Primary Branch
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground/80" />
                      {branch.address ? `${branch.address}, ` : ""}
                      {branch.city}, {branch.state || branch.postalCode}
                    </span>
                    {branch.phone && (
                      <span className="flex items-center gap-1.5">
                        <PhoneIcon className="size-3.5 shrink-0 text-muted-foreground/80" />
                        {branch.phone}
                      </span>
                    )}
                    {branch.managerName && (
                      <span className="flex items-center gap-1.5">
                        <UserIcon className="size-3.5 shrink-0 text-muted-foreground/80" />
                        Manager: {branch.managerName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Branch Card Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!branch.isPrimary && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setPrimaryBranch(branch.id)}
                    >
                      Set as Primary
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleOpenEdit(branch)}
                  >
                    <Edit2Icon className="size-3.5" />
                    Edit
                  </Button>
                  {branches.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => removeBranch(branch.id)}
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add / Edit Branch Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBranchId ? "Edit Branch Details" : "Add Property Branch"}
            </DialogTitle>
            <DialogDescription>
              Provide the operational address and contact details for this specific branch.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="branch-name" className="text-xs font-medium">
                Branch / Property Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="branch-name"
                placeholder="e.g. Royal Mirage — Heritage Wing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-xs font-medium text-destructive">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-code" className="text-xs font-medium">
                Branch Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="branch-code"
                placeholder="e.g. UDR-HW"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className={`uppercase ${formErrors.code ? "border-destructive" : ""}`}
              />
              {formErrors.code && (
                <p className="text-xs font-medium text-destructive">{formErrors.code}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-city" className="text-xs font-medium">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="branch-city"
                placeholder="e.g. Udaipur"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={formErrors.city ? "border-destructive" : ""}
              />
              {formErrors.city && (
                <p className="text-xs font-medium text-destructive">{formErrors.city}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="branch-address" className="text-xs font-medium">
                Street Address
              </Label>
              <Input
                id="branch-address"
                placeholder="Palace Road, Near Lake Pichola"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-state" className="text-xs font-medium">
                State / Province
              </Label>
              <Input
                id="branch-state"
                placeholder="Rajasthan"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-postal" className="text-xs font-medium">
                Postal Code / PIN
              </Label>
              <Input
                id="branch-postal"
                placeholder="313001"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-phone" className="text-xs font-medium">
                Direct Desk Phone
              </Label>
              <Input
                id="branch-phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch-email" className="text-xs font-medium">
                Branch Email
              </Label>
              <Input
                id="branch-email"
                type="email"
                placeholder="desk@royalmirage.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="branch-manager" className="text-xs font-medium">
                General Manager / Contact Person
              </Label>
              <Input
                id="branch-manager"
                placeholder="e.g. Vikramaditya Rathore"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-2 sm:col-span-2">
              <input
                type="checkbox"
                id="branch-primary-toggle"
                checked={formData.isPrimary}
                onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="branch-primary-toggle" className="cursor-pointer text-xs font-medium">
                Designate as Primary Operating Branch
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveDialog}>
              {editingBranchId ? "Save Changes" : "Add Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
