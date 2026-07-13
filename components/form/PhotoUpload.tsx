"use client";

import { useCallback, useRef, useState } from "react";
import { normalizeImageFile } from "@/lib/image-upload";

export type PhotoItem = {
  file: File;
  preview: string;
  comment: string;
};

export function ScreenshotGuide() {
  return (
    <div className="rounded-xl border border-sage/25 bg-sage-light/25 p-4 text-sm">
      <p className="font-medium text-sage-dark">Kaip padaryti ir įkelti ekrano nuotrauką?</p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-ink-muted">
        <li>
          <strong className="text-ink">Windows:</strong> paspauskite{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">Win + Shift + S</code> — pažymėkite
          langą ar problematišką vietą
        </li>
        <li>
          <strong className="text-ink">Mac:</strong> paspauskite{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">Cmd + Shift + 4</code>
        </li>
        <li>
          Nuotrauka išsaugoma į <strong className="text-ink">iškarpinę</strong>. Spustelėkite žalią
          lauką žemiau (ne mygtuką „Pasirinkti failą“) ir paspauskite{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">Ctrl + V</code>{" "}
          (<code className="rounded bg-white px-1.5 py-0.5 text-xs">Cmd + V</code> Mac)
        </li>
        <li>
          Arba vilkite failą į lauką, arba paspauskite „Pasirinkti failą iš kompiuterio“
        </li>
      </ol>
      <p className="mt-3 text-ink-muted">
        Po įkėlimo parašykite komentarą — kas matoma, kas neveikia. Geriausia: 1 nuotrauka = 1 žingsnis.
      </p>
    </div>
  );
}

export function PhotoUpload({
  photos,
  onChange,
  maxFiles = 5,
}: {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  maxFiles?: number;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [pasteFocused, setPasteFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteZoneRef = useRef<HTMLDivElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return;
      const remaining = maxFiles - photos.length;
      const toAdd = Array.from(files)
        .map((file, index) => normalizeImageFile(file, index))
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);

      if (toAdd.length === 0) return;

      const newPhotos: PhotoItem[] = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        comment: "",
      }));

      onChange([...photos, ...newPhotos]);
    },
    [photos, onChange, maxFiles]
  );

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      addFiles(imageFiles);
    }
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(photos[index].preview);
    onChange(photos.filter((_, i) => i !== index));
  }

  function updateComment(index: number, comment: string) {
    onChange(photos.map((p, i) => (i === index ? { ...p, comment } : p)));
  }

  return (
    <div className="space-y-4">
      <ScreenshotGuide />

      {photos.length < maxFiles && (
        <div
          className={`rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
            dragOver ? "border-sage bg-sage-light/30" : "border-cream-dark"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <div
            ref={pasteZoneRef}
            tabIndex={0}
            role="textbox"
            aria-label="Įklijuokite ekrano nuotrauką iš iškarpinės"
            onPaste={handlePaste}
            onFocus={() => setPasteFocused(true)}
            onBlur={() => setPasteFocused(false)}
            onClick={() => pasteZoneRef.current?.focus()}
            className={`cursor-text rounded-xl border-2 px-6 py-8 text-center transition-colors outline-none ${
              pasteFocused
                ? "border-sage bg-sage-light/40 ring-2 ring-sage/30"
                : "border-sage/40 bg-sage-light/20 hover:border-sage hover:bg-sage-light/30"
            }`}
          >
            <p className="font-medium text-ink">Įklijuokite nuotrauką iš iškarpinės</p>
            <p className="mt-2 text-sm text-ink-muted">
              Spustelėkite šį žalią lauką, tada{" "}
              <strong className="text-ink">Ctrl + V</strong> (Mac:{" "}
              <strong className="text-ink">Cmd + V</strong>)
            </p>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-cream-dark bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-sage hover:bg-cream cursor-pointer"
            >
              Pasirinkti failą iš kompiuterio
            </button>
            <p className="text-xs text-ink-light">
              Arba vilkite failus čia · JPG, PNG, WEBP — iki {maxFiles} failų
            </p>
          </div>
        </div>
      )}

      {photos.map((photo, i) => (
        <div key={photo.preview} className="rounded-xl border border-cream-dark bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.preview}
              alt={`Nuotrauka ${i + 1}`}
              className="h-40 w-full rounded-lg border border-cream-dark object-contain bg-cream sm:h-36 sm:w-48"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-ink">
                  Nuotrauka {i + 1}: {photo.file.name}
                </p>
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="text-sm text-ink-light hover:text-ink cursor-pointer"
                >
                  Pašalinti
                </button>
              </div>
              <textarea
                value={photo.comment}
                onChange={(e) => updateComment(i, e.target.value)}
                placeholder="Ką rodo ši nuotrauka? Kur spustelėti? Kas neveikia? Ką norėtumėte, kad veiktų kitaip?"
                rows={4}
                className="mt-2 w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-light focus:border-sage focus:outline-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
