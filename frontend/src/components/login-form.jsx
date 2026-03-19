import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field"
import login from "@/apiServices/login"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function LoginForm({ className, ...props }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [textbutton, setTextButton] = useState("Login")
  //check hook
  const [rememberMe, setRemember] = useState(false);

  useEffect(() => {

    const rememberMe = localStorage.getItem("rememberUser");
    localStorage.setItem("loggedIn", false);

    if (rememberMe != null) {
      setUserName(rememberMe);
      setRemember(true);
    }
  }, [])
  const handdlebutton = async () => {
    setTextButton("loading...");
    try {
      let succes = await login(userName, password);
      if (succes) {
        if (rememberMe) {
          localStorage.setItem("rememberUser", userName);
        }
        else {
          localStorage.removeItem("rememberUser");
        }
        setTextButton("success full");
        localStorage.setItem("loggedIn", true); //asegurar que el usuario este logeado
        navigate("/home");
      } else {
        setTextButton("Login failed");
      }

    } catch (error) {
      alert("Error... ", error);
    }

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            handdlebutton();
          }}>
            <FieldGroup>
              <Field>
                <div className="flex gap-3">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="flex">
                    <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRemember(checked)}></Checkbox>
                    <Label htmlFor="remmber-checkbox">Remember</Label>
                  </div>
                </div>
                <Input id="email" type="email" placeholder="m@example.com" value={userName} onChange={(e) => setUserName(e.target.value)} required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>

                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Field>
              <Field>
                <Button type="submit" className="cursor-pointer">{textbutton} </Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                {/* <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription> */}
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}
