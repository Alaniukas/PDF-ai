"use client";

import { useCallback, useEffect, useState } from "react";

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
          Nuotrauka išsaugoma į <strong className="text-ink">iškarpinę</strong> (clipboard). Tada spustelėkite
          žemiau esantį lauką ir paspauskite{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">Ctrl + V</code>{" "}
          (<code className="rounded bg-white px-1.5 py-0.5 text-xs">Cmd + V</code> Mac)
        </li>
        <li>
          Arba vilkite failą į lauką, arba spustelėkite ir pasirinkite iš kompiuterio (pvz. iš
          Atsisiuntimų, jei išsaugojote)
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

  const addFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return;
      const remaining = maxFiles - photos.length;
      const toAdd = Array.from(files)
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

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
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

    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [addFiles]);

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
        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors outline-none focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/30 ${
            dragOver ? "border-sage bg-sage-light/30" : "border-cream-dark hover:border-sage"
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
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <p className="font-medium text-ink">Įkelkite ekrano nuotraukas</p>
          <p className="mt-1 text-center text-sm text-ink-muted">
            Spustelėkite čia ir paspauskite{" "}
            <strong className="text-ink">Ctrl + V</strong>, jei nuotrauka jau iškarpinėje
          </p>
          <p className="mt-1 text-xs text-ink-light">
            Arba vilkite failus · JPG, PNG, WEBP — iki {maxFiles} failų
          </p>
        </label>
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
