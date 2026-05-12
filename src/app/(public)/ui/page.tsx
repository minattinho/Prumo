"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Toggle } from "@/components/ui/toggle";
import { Kbd } from "@/components/ui/kbd";
import { AlertCircle, Info, ShieldCheck, Star, Zap } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold text-azul-noite mb-1">{title}</h2>
      <Separator className="mb-5" />
      {children}
    </section>
  );
}

export default function UIDemo() {
  const [progress] = useState(60);
  const [slider, setSlider] = useState([40]);
  const [checked, setChecked] = useState(true);
  const [toggled, setToggled] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <Badge variant="outline" className="mb-3">shadcn/ui</Badge>
        <h1 className="text-3xl font-bold text-azul-noite">Componentes Prumo</h1>
        <p className="text-muted-foreground mt-1">Design system com tokens da marca aplicados.</p>
      </div>

      {/* BUTTONS */}
      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Principal</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destrutivo</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Desabilitado</Button>
          <Button size="sm">Pequeno</Button>
          <Button size="lg">Grande</Button>
        </div>
        <div className="mt-4">
          <ButtonGroup>
            <Button variant="outline">Esquerda</Button>
            <Button variant="outline">Centro</Button>
            <Button variant="outline">Direita</Button>
          </ButtonGroup>
        </div>
      </Section>

      {/* BADGES */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Erro</Badge>
        </div>
      </Section>

      {/* ALERTS */}
      <Section title="Alerts">
        <div className="flex flex-col gap-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>Seu perfil está em análise. Aguarde até 24h para ativação.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>CPF não encontrado ou inválido. Verifique os dados informados.</AlertDescription>
          </Alert>
        </div>
      </Section>

      {/* FORM INPUTS */}
      <Section title="Inputs & Form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" placeholder="João da Silva" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cidade">Cidade</Label>
            <Select>
              <SelectTrigger id="cidade">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sp">São Paulo</SelectItem>
                <SelectItem value="rj">Rio de Janeiro</SelectItem>
                <SelectItem value="bh">Belo Horizonte</SelectItem>
                <SelectItem value="cwb">Curitiba</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="bio">Descrição do serviço</Label>
            <Textarea id="bio" placeholder="Descreva sua especialidade e experiência..." rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
            <Label htmlFor="terms">Aceito os termos de uso</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="notif" checked={toggled} onCheckedChange={setToggled} />
            <Label htmlFor="notif">Receber notificações</Label>
          </div>
        </div>
      </Section>

      {/* TABS */}
      <Section title="Tabs">
        <Tabs defaultValue="perfil">
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          </TabsList>
          <TabsContent value="perfil" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados do profissional</CardTitle>
                <CardDescription>Informações públicas exibidas no perfil.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarImage src="" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">João da Silva</p>
                  <p className="text-sm text-muted-foreground">Eletricista · São Paulo, SP</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-xs text-muted-foreground">(42 avaliações)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Editar perfil</Button>
                <Button size="sm" variant="outline">Ver como público</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="portfolio" className="mt-4 text-sm text-muted-foreground">
            Nenhuma foto adicionada ainda.
          </TabsContent>
          <TabsContent value="avaliacoes" className="mt-4 text-sm text-muted-foreground">
            Sem avaliações por enquanto.
          </TabsContent>
        </Tabs>
      </Section>

      {/* PROGRESS / SLIDER */}
      <Section title="Progress & Slider">
        <div className="flex flex-col gap-5 max-w-md">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Perfil completo</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Raio de busca: {slider[0]} km</Label>
            <Slider
              value={slider}
              onValueChange={(v) => setSlider(Array.isArray(v) ? [...v] : [v as number])}
              min={1}
              max={100}
              step={1}
            />
          </div>
        </div>
      </Section>

      {/* SKELETON */}
      <Section title="Skeleton">
        <div className="flex items-center gap-4 max-w-sm">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </Section>

      {/* ACCORDION */}
      <Section title="Accordion">
        <Accordion multiple={false} className="max-w-lg">
          <AccordionItem value="q1">
            <AccordionTrigger>Como funciona a verificação de CPF?</AccordionTrigger>
            <AccordionContent>
              Integramos com a base da Receita Federal via SERPRO. O CPF é validado em tempo real durante o cadastro.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Posso cancelar minha assinatura?</AccordionTrigger>
            <AccordionContent>
              Sim. Cancele a qualquer momento pelo painel do profissional, sem multa ou burocracia.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>As avaliações são verificadas?</AccordionTrigger>
            <AccordionContent>
              Somente usuários que tiveram contato registrado com o profissional podem avaliar. Zero avaliação falsa.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      {/* DIALOG + TOOLTIP + TOGGLE + KBD */}
      <Section title="Dialog · Tooltip · Toggle · Kbd">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Abrir dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar ação</DialogTitle>
                <DialogDescription>Tem certeza que deseja excluir este portfólio? Esta ação não pode ser desfeita.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button variant="destructive">Excluir</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger
              render={
                <button className={buttonVariants({ variant: "outline", size: "icon" })} />
              }
            >
              <ShieldCheck size={16} />
            </TooltipTrigger>
            <TooltipContent>Perfil verificado pelo Prumo</TooltipContent>
          </Tooltip>

          <Toggle pressed={toggled} onPressedChange={setToggled} aria-label="Destaque">
            <Zap size={14} />
            Destaque
          </Toggle>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Salvar <Kbd>⌘</Kbd><Kbd>S</Kbd>
          </div>
        </div>
      </Section>

      {/* SPINNER */}
      <Section title="Spinner">
        <div className="flex items-center gap-4">
          <Spinner className="size-3" />
          <Spinner className="size-4" />
          <Spinner className="size-6" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-3" />
            Carregando profissionais...
          </div>
        </div>
      </Section>
    </div>
  );
}
