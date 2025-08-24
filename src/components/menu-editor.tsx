"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  GripVertical,
  Wand2,
  EyeOff,
  Eye,
  Paintbrush,
} from "lucide-react";
import { nanoid } from "nanoid";
import type {
  MenuBoard,
  MenuItem,
  Section,
  LocalizedString,
  Lang,
} from "@/lib/types";
import { SortableRow } from "./sortable-row";
import { formatCurrency } from "@/lib/utils-local";
import { LANG_LABEL } from "@/lib/i18n";
import {
  classifyCategory,
  CATEGORY_LABEL,
  type CategoryKey,
} from "@/lib/categories";
import { suggestPalette, FONT_PAIRS } from "@/lib/theme";

type EditorProps = {
  value: MenuBoard;
  onChange?: (next: MenuBoard) => void;
  onSave?: (next: MenuBoard) => void;
};

const emptyLS = (): LocalizedString => ({ default: "" });

export function MenuEditor({
  value,
  onChange = () => {},
  onSave = () => {},
}: EditorProps) {
  const [local, setLocal] = useState<MenuBoard>(value);
  const [draggingSectionId, setDraggingSectionId] = useState<string | null>(
    null
  );

  useMemo(() => {
    if (value.id === local.id) setLocal(value);
  }, [value]);

  const update = (updater: (prev: MenuBoard) => MenuBoard) => {
    const next = updater(local);
    setLocal(next);
    onChange(next);
  };

  const updateLS = (
    ls: LocalizedString | undefined,
    lang: Lang,
    text: string
  ): LocalizedString => {
    const base = ls ?? emptyLS();
    return { ...base, [lang]: text };
  };

  const addSection = () => {
    update((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { id: nanoid(), name: emptyLS(), items: [] },
      ],
    }));
  };

  const removeSection = (id: string) => {
    update((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  };

  const addItem = (sectionId: string) => {
    update((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: nanoid(),
                  name: emptyLS(),
                  description: emptyLS(),
                  price: 0,
                  image: "",
                  tags: [],
                  category: undefined,
                  status: "available",
                },
              ],
            }
          : s
      ),
    }));
  };

  const removeItem = (sectionId: string, itemId: string) => {
    update((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
          : s
      ),
    }));
  };

  const updateSection = (sectionId: string, patch: Partial<Section>) => {
    update((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...patch } : s
      ),
    }));
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    patch: Partial<MenuItem>
  ) => {
    update((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((i) =>
                i.id === itemId ? { ...i, ...patch } : i
              ),
            }
          : s
      ),
    }));
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const sectionIds = local.sections.map((s) => s.id);

    // Check if dragging a section
    if (sectionIds.includes(String(active.id))) {
      setDraggingSectionId(String(active.id));
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.log("onDragEnd", event);
    setDraggingSectionId(null); // Reset dragging state

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sectionIds = local.sections.map((s) => s.id);

    // Handle section reordering
    if (
      sectionIds.includes(String(active.id)) &&
      sectionIds.includes(String(over.id))
    ) {
      const oldIndex = sectionIds.indexOf(String(active.id));
      const newIndex = sectionIds.indexOf(String(over.id));
      update((prev) => ({
        ...prev,
        sections: arrayMove(prev.sections, oldIndex, newIndex),
      }));
      return;
    }

    // Handle item reordering within sections
    for (const section of local.sections) {
      const itemIds = section.items.map((i) => i.id);
      if (
        itemIds.includes(String(active.id)) &&
        itemIds.includes(String(over.id))
      ) {
        const oldIndex = itemIds.indexOf(String(active.id));
        const newIndex = itemIds.indexOf(String(over.id));
        update((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === section.id
              ? { ...s, items: arrayMove(s.items, oldIndex, newIndex) }
              : s
          ),
        }));
        break;
      }
    }
  };

  // Helpers
  const autoClassifySection = (sectionId: string) => {
    update((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((it) => {
                const text = `${it.name?.default ?? ""} ${it.name?.en ?? ""} ${
                  it.name?.zh ?? ""
                } ${it.description?.default ?? ""} ${
                  it.description?.en ?? ""
                } ${it.description?.zh ?? ""}`;
                const cat = classifyCategory(text);
                return { ...it, category: cat };
              }),
            }
          : s
      ),
    }));
  };

  const suggestColors = () => {
    const base = local.theme?.primary || "#16a34a";
    const pal = suggestPalette(base);
    update((p) => ({
      ...p,
      theme: {
        ...(p.theme ?? { fontPair: "inter-playfair", template: "blank" }),
        ...pal,
      },
    }));
  };

  return (
    <div className="grid gap-6 p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>메뉴판 정보</CardTitle>
          <div className="text-muted-foreground text-xs">
            브랜드 테마와 다국어(일본어어/EN/中文), 통화를 설정하세요. 팔레트
            추천으로 빠르게 테마를 정할 수 있습니다.
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="font-medium text-sm" htmlFor="menu-title-ko">
                제목 (기본)
              </Label>
              <Input
                id="menu-title-ko"
                placeholder="예: 평일 런치"
                value={local.title?.default ?? ""}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    title: updateLS(p.title, "default", e.target.value),
                  }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    className="text-muted-foreground text-xs"
                    htmlFor="menu-title-en"
                  >
                    제목 (EN)
                  </Label>
                  <Input
                    id="menu-title-en"
                    value={local.title?.en ?? ""}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        title: updateLS(p.title, "en", e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label
                    className="text-muted-foreground text-xs"
                    htmlFor="menu-title-zh"
                  >
                    제목 (中文)
                  </Label>
                  <Input
                    id="menu-title-zh"
                    value={local.title?.zh ?? ""}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        title: updateLS(p.title, "zh", e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="font-medium text-sm">기본 언어</Label>
              <Select
                value={local.defaultLang}
                onValueChange={(v: any) =>
                  update((p) => ({ ...p, defaultLang: v }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="기본" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{LANG_LABEL.default}</SelectItem>
                  <SelectItem value="en">{LANG_LABEL.en}</SelectItem>
                  <SelectItem value="zh">{LANG_LABEL.zh}</SelectItem>
                </SelectContent>
              </Select>
              <Label className="font-medium text-sm" htmlFor="menu-curr">
                통화
              </Label>
              <Input
                id="menu-curr"
                placeholder="예: KRW"
                value={local.currency ?? "KRW"}
                onChange={(e) =>
                  update((p) => ({ ...p, currency: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label
                className="font-medium text-sm"
                htmlFor="menu-desc-default"
              >
                설명 (기본)
              </Label>
              <Input
                id="menu-desc-default"
                placeholder="예: 평일 런치 스페셜"
                value={local.description?.default ?? ""}
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    description: updateLS(
                      p.description,
                      "default",
                      e.target.value
                    ),
                  }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    className="text-muted-foreground text-xs"
                    htmlFor="menu-desc-en"
                  >
                    설명 (EN)
                  </Label>
                  <Input
                    id="menu-desc-en"
                    value={local.description?.en ?? ""}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        description: updateLS(
                          p.description,
                          "en",
                          e.target.value
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label
                    className="text-muted-foreground text-xs"
                    htmlFor="menu-desc-zh"
                  >
                    설명 (中文)
                  </Label>
                  <Input
                    id="menu-desc-zh"
                    value={local.description?.zh ?? ""}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        description: updateLS(
                          p.description,
                          "zh",
                          e.target.value
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="font-medium text-sm">브랜드 색상</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Primary
                  </Label>
                  <Input
                    type="color"
                    value={local.theme?.primary ?? "#16a34a"}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        theme: { ...(p.theme ?? {}), primary: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Secondary
                  </Label>
                  <Input
                    type="color"
                    value={local.theme?.secondary ?? "#0ea5e9"}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        theme: {
                          ...(p.theme ?? {}),
                          secondary: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Accent
                  </Label>
                  <Input
                    type="color"
                    value={local.theme?.accent ?? "#f59e0b"}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        theme: { ...(p.theme ?? {}), accent: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={suggestColors}
                className="mt-2 inline-flex items-center gap-2 bg-transparent"
              >
                <Paintbrush className="h-4 w-4" />
                팔레트 추천
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="font-medium text-sm">폰트 조합</Label>
              <Select
                value={local.theme?.fontPair ?? "inter-playfair"}
                onValueChange={(v) =>
                  update((p) => ({
                    ...p,
                    theme: { ...(p.theme ?? {}), fontPair: v as any },
                  }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="폰트 조합" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_PAIRS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                고급: 실제 웹폰트 로드는 향후 설정에서 추가.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="font-medium text-sm">이미지 AI 생성</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  alert(
                    "이미지 AI는 FAL 등의 API 키 연결 후 사용 가능합니다. 설정 > 통합에서 키를 추가하세요."
                  )
                }
              >
                AI 이미지 생성 연결
              </Button>
              <p className="text-muted-foreground text-xs">
                키를 연결하면 메뉴 이미지 자동 생성 가능.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">섹션 & 메뉴</h3>
        <Button onClick={addSection} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          섹션 추가
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={[
            ...local.sections.map((s) => s.id),
            ...local.sections.flatMap((s) => s.items.map((i) => i.id)),
          ]}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4 ">
            {local.sections.map((section) => (
              <SortableRow key={section.id} id={section.id}>
                {({ dragHandleProps }) => (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <GripVertical
                            className="h-4 w-4 cursor-grab text-muted-foreground active:cursor-grabbing"
                            aria-hidden
                            {...dragHandleProps}
                          />
                          <Input
                            value={section.name?.default ?? ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                name: {
                                  ...(section.name ?? { default: "" }),
                                  default: e.target.value,
                                },
                              })
                            }
                            aria-label="섹션 이름(기본)"
                            className="h-9"
                            placeholder="섹션 이름 (기본)"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => autoClassifySection(section.id)}
                            className="ml-2 inline-flex items-center gap-2"
                          >
                            <Wand2 className="h-4 w-4" /> 자동 분류
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pl-6">
                          <Input
                            placeholder="섹션 이름 (EN)"
                            value={section.name?.en ?? ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                name: {
                                  ...(section.name ?? { default: "" }),
                                  en: e.target.value,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="섹션 이름 (中文)"
                            value={section.name?.zh ?? ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                name: {
                                  ...(section.name ?? { default: "" }),
                                  zh: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeSection(section.id)}
                        aria-label="섹션 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    {!draggingSectionId && (
                      <CardContent className="grid gap-3">
                        <div className="grid gap-3">
                          {section.items.map((item) => (
                            <SortableRow key={item.id} id={item.id}>
                              <div className="rounded-md border p-3">
                                <div className="flex items-start gap-3">
                                  <GripVertical
                                    className="mt-2 h-4 w-4 cursor-grab text-muted-foreground active:cursor-grabbing"
                                    aria-hidden
                                  />
                                  <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-12">
                                    <div className="md:col-span-4">
                                      <Label className="text-muted-foreground text-xs">
                                        이름 (기본)
                                      </Label>
                                      <Input
                                        value={item.name?.default ?? ""}
                                        onChange={(e) =>
                                          updateItem(section.id, item.id, {
                                            name: {
                                              ...(item.name ?? { default: "" }),
                                              default: e.target.value,
                                            },
                                          })
                                        }
                                      />
                                      <div className="mt-2 grid grid-cols-2 gap-2">
                                        <Input
                                          placeholder="이름 (EN)"
                                          value={item.name?.en ?? ""}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, {
                                              name: {
                                                ...(item.name ?? {
                                                  default: "",
                                                }),
                                                en: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                        <Input
                                          placeholder="이름 (中文)"
                                          value={item.name?.zh ?? ""}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, {
                                              name: {
                                                ...(item.name ?? {
                                                  default: "",
                                                }),
                                                zh: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="md:col-span-2">
                                      <Label className="text-muted-foreground text-xs">
                                        가격
                                      </Label>
                                      <Input
                                        type="number"
                                        inputMode="decimal"
                                        value={String(item.price)}
                                        onChange={(e) =>
                                          updateItem(section.id, item.id, {
                                            price: Number(e.target.value || 0),
                                          })
                                        }
                                      />
                                      <p className="mt-1 text-[11px] text-muted-foreground">
                                        미리보기:{" "}
                                        {formatCurrency(
                                          item.price,
                                          local.currency
                                        )}
                                      </p>
                                    </div>
                                    <div className="md:col-span-3">
                                      <Label className="text-muted-foreground text-xs">
                                        카테고리
                                      </Label>
                                      <Select
                                        value={
                                          (item.category as CategoryKey) ||
                                          "other"
                                        }
                                        onValueChange={(v) =>
                                          updateItem(section.id, item.id, {
                                            category: v,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="h-9">
                                          <SelectValue placeholder="카테고리" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.entries(CATEGORY_LABEL).map(
                                            ([k, v]) => (
                                              <SelectItem key={k} value={k}>
                                                {v}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="mt-2 bg-transparent"
                                        onClick={() => {
                                          const text = `${
                                            item.name?.default ?? ""
                                          } ${item.name?.en ?? ""} ${
                                            item.name?.zh ?? ""
                                          } ${
                                            item.description?.default ?? ""
                                          } ${item.description?.en ?? ""} ${
                                            item.description?.zh ?? ""
                                          }`;
                                          const cat = classifyCategory(text);
                                          updateItem(section.id, item.id, {
                                            category: cat,
                                          });
                                        }}
                                      >
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        자동 분류
                                      </Button>
                                    </div>
                                    <div className="md:col-span-3">
                                      <Label className="text-muted-foreground text-xs">
                                        상태
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant={
                                            item.status !== "soldout"
                                              ? "default"
                                              : "outline"
                                          }
                                          onClick={() =>
                                            updateItem(section.id, item.id, {
                                              status: "available",
                                            })
                                          }
                                          className="inline-flex items-center gap-1"
                                        >
                                          <Eye className="h-4 w-4" />
                                          판매중
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant={
                                            item.status === "soldout"
                                              ? "destructive"
                                              : "outline"
                                          }
                                          onClick={() =>
                                            updateItem(section.id, item.id, {
                                              status: "soldout",
                                            })
                                          }
                                          className="inline-flex items-center gap-1"
                                        >
                                          <EyeOff className="h-4 w-4" />
                                          품절
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="md:col-span-12">
                                      <Label className="text-muted-foreground text-xs">
                                        이미지 URL
                                      </Label>
                                      <Input
                                        placeholder="https://..."
                                        value={item.image ?? ""}
                                        onChange={(e) =>
                                          updateItem(section.id, item.id, {
                                            image: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="md:col-span-12">
                                      <Label className="text-muted-foreground text-xs">
                                        설명 (기본)
                                      </Label>
                                      <Textarea
                                        rows={2}
                                        value={item.description?.default ?? ""}
                                        onChange={(e) =>
                                          updateItem(section.id, item.id, {
                                            description: {
                                              ...(item.description ?? {
                                                default: "",
                                              }),
                                              default: e.target.value,
                                            },
                                          })
                                        }
                                      />
                                      <div className="mt-2 grid grid-cols-2 gap-2">
                                        <Textarea
                                          rows={2}
                                          placeholder="설명 (EN)"
                                          value={item.description?.en ?? ""}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, {
                                              description: {
                                                ...(item.description ?? {
                                                  default: "",
                                                }),
                                                en: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                        <Textarea
                                          rows={2}
                                          placeholder="설명 (中文)"
                                          value={item.description?.zh ?? ""}
                                          onChange={(e) =>
                                            updateItem(section.id, item.id, {
                                              description: {
                                                ...(item.description ?? {
                                                  default: "",
                                                }),
                                                zh: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      removeItem(section.id, item.id)
                                    }
                                    aria-label="메뉴 삭제"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </SortableRow>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={() => addItem(section.id)}
                            className="inline-flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            메뉴 추가
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Separator />
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => onSave(local)}>
          저장
        </Button>
      </div>
    </div>
  );
}
