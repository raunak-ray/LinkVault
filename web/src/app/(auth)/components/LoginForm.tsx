import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
  return (
    <Card className="w-lg md:max-w-2xl lg:max-w-4xl bg-[#1f2731]">
      <CardHeader className="">
        <CardTitle>Log in</CardTitle>
        <CardDescription>Logged in to your account</CardDescription>
      </CardHeader>
    </Card>
  );
}
