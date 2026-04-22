import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Clock,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  Lock,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react";

type Month = "feb" | "mar" | "apr";
type Mode = "home" | "admin-login" | "admin-dashboard" | "employee-login" | "employee-dashboard";

const MONTH_LABELS: Record<Month, string> = {
  feb: "February",
  mar: "March",
  apr: "April",
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("home");
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [adminCode, setAdminCode] = useState("");
  const [adminError, setAdminError] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [authedEmployee, setAuthedEmployee] = useState("");
  const [selectedEmployeeAdmin, setSelectedEmployeeAdmin] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingList, setIsRefreshingList] = useState(false);

  const verifyAdmin = trpc.employee.verifyAdmin.useMutation();
  const verifyEmployee = trpc.employee.verifyEmployee.useMutation();

  const hasCodeQuery = trpc.employee.hasCode.useQuery(
    { name: employeeName },
    { enabled: !!employeeName && mode === "employee-login" }
  );

  const { data: namesData, isLoading: namesLoading, refetch: refetchNames } = trpc.employee.listNames.useQuery(
    { month: selectedMonth! },
    { enabled: !!selectedMonth && (mode === "employee-login" || mode === "admin-dashboard") }
  );

  const { data: hoursData, isLoading: hoursLoading, refetch: refetchHours } = trpc.employee.getHours.useQuery(
    { name: authedEmployee, month: selectedMonth! },
    { enabled: !!authedEmployee && !!selectedMonth && mode === "employee-dashboard" }
  );

  const { data: adminHoursData, isLoading: adminHoursLoading, refetch: refetchAdminHours } = trpc.employee.getHours.useQuery(
    { name: selectedEmployeeAdmin, month: selectedMonth! },
    { enabled: !!selectedEmployeeAdmin && !!selectedMonth && mode === "admin-dashboard" }
  );

  const { data: allHoursData, isLoading: allHoursLoading, refetch: refetchAllHours } = trpc.employee.getAllHours.useQuery(
    { month: selectedMonth! },
    { enabled: !!selectedMonth && mode === "admin-dashboard" }
  );

  const handleSelectMonth = (month: Month) => {
    setSelectedMonth(month);
    setMode("home");
  };

  const handleAdminLogin = async () => {
    setAdminError("");
    const result = await verifyAdmin.mutateAsync({ code: adminCode });
    if (result.success) {
      setMode("admin-dashboard");
    } else {
      setAdminError("كود غلط! الكود اللي دخلته مش صح.");
    }
  };

  const handleEmployeeLogin = async () => {
    setEmployeeError("");
    const result = await verifyEmployee.mutateAsync({ name: employeeName, code: employeeCode });
    if (result.success) {
      setAuthedEmployee(employeeName);
      setMode("employee-dashboard");
    } else {
      setEmployeeError("كود غلط!");
    }
  };

  const handleLogout = () => {
    setMode("home");
    setSelectedMonth(null);
    setAdminCode("");
    setAdminError("");
    setEmployeeName("");
    setEmployeeCode("");
    setEmployeeError("");
    setAuthedEmployee("");
    setSelectedEmployeeAdmin("");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchHours();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefreshList = async () => {
    setIsRefreshingList(true);
    try {
      await refetchNames();
    } finally {
      setIsRefreshingList(false);
    }
  };

  const showNoCodeMessage = employeeName && hasCodeQuery.data && !hasCodeQuery.data.hasCode;

  // ─── HOME: Select Month ───────────────────────────────────────────────
  if (!selectedMonth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Pero Hours</h1>
            <p className="text-muted-foreground">Select a month to get started</p>
          </div>
          <div className="space-y-3">
            {(["feb", "mar", "apr"] as Month[]).map((month) => (
              <button
                key={month}
                onClick={() => { setSelectedMonth(month); setMode("home"); }}
                className="w-full p-5 rounded-xl border border-border/50 bg-card hover:bg-accent/5 hover:border-accent/30 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">{MONTH_LABELS[month]}</span>
                  <ChevronLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:text-accent transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── MONTH SELECTED: Choose Mode ─────────────────────────────────────
  if (selectedMonth && mode === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
              {MONTH_LABELS[selectedMonth]} Hours
            </h1>
            <p className="text-muted-foreground">Secure Access</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setMode("admin-login")}
              className="w-full p-6 rounded-xl border border-border/50 bg-card hover:bg-accent/5 hover:border-accent/30 transition-all text-center group"
            >
              <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
              <p className="text-lg font-semibold text-foreground">Admin Mode</p>
            </button>
            <button
              onClick={() => setMode("employee-login")}
              className="w-full p-6 rounded-xl border border-border/50 bg-card hover:bg-accent/5 hover:border-accent/30 transition-all text-center group"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
              <p className="text-lg font-semibold text-foreground">Employee Mode</p>
            </button>
          </div>
          <button
            onClick={() => setSelectedMonth(null)}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back to months
          </button>
        </div>
      </div>
    );
  }

  // ─── ADMIN LOGIN ──────────────────────────────────────────────────────
  if (mode === "admin-login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                <CardTitle>Admin Access</CardTitle>
              </div>
              <CardDescription>Enter the admin code to view all employee data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Admin Code</Label>
                <Input
                  type="password"
                  placeholder="Enter admin code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                />
              </div>
              {adminError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm font-medium">{adminError}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode("home")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleAdminLogin}
                  disabled={!adminCode || verifyAdmin.isPending}
                  className="flex-1"
                >
                  {verifyAdmin.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Access"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── EMPLOYEE LOGIN ───────────────────────────────────────────────────
  if (mode === "employee-login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <CardTitle>Employee Access</CardTitle>
              </div>
              <CardDescription>Select your name and enter your personal code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Your Name</Label>
                  <button onClick={handleRefreshList} disabled={isRefreshingList || namesLoading}>
                    <RotateCw className={`h-4 w-4 text-muted-foreground hover:text-foreground ${isRefreshingList ? "animate-spin" : ""}`} />
                  </button>
                </div>
                {namesLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <Select value={employeeName} onValueChange={setEmployeeName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your name..." />
                    </SelectTrigger>
                    <SelectContent>
                      {namesData?.names?.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* No code message - shows when name selected and has no code */}
              {showNoCodeMessage && (
                <div className="flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    لو موظف جديد ولسه ضايف اسمك في الشيت؟ مالكش كود؟{" "}
                    <a
                      href="https://wa.me/201027816555"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      send message to aya hafez on whatsapp 01027816555
                    </a>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Your Code</Label>
                <Input
                  type="password"
                  placeholder="Enter your personal code"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmployeeLogin()}
                />
              </div>

              {employeeError && (
                <>
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm font-medium">{employeeError}</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                      لو موظف جديد ولسه ضايف اسمك في الشيت؟ مالكش كود؟{" "}
                      <a
                        href="https://wa.me/201027816555"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                      >
                        send message to aya hafez on whatsapp 01027816555
                      </a>
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode("home")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleEmployeeLogin}
                  disabled={!employeeName || !employeeCode || verifyEmployee.isPending}
                  className="flex-1"
                >
                  {verifyEmployee.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Access"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD ─────────────────────────────────────────────────
  if (mode === "admin-dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {MONTH_LABELS[selectedMonth!]} Hours
              </h1>
              <p className="text-sm text-accent font-medium mt-1">Admin Mode — Viewing all employee data</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>

          <div className="space-y-6">
            {/* Total Summary */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Total Hours Summary</CardTitle>
                <CardDescription>All employees aggregate hours for {MONTH_LABELS[selectedMonth!]}</CardDescription>
              </CardHeader>
              <CardContent>
                {allHoursLoading ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <div className="rounded-lg bg-accent/5 border border-accent/20 p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Hours (All Employees)</p>
                      <p className="text-4xl font-bold text-accent">{allHoursData?.totalHours?.toFixed(2) ?? "0"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{allHoursData?.count ?? 0} employees</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-12 w-12 text-accent/30" />
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={() => refetchAllHours()}>
                        <RotateCw className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Select Employee */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Select Employee</CardTitle>
                <CardDescription>
                  {namesData?.count ? `${namesData.count} employees found` : "Loading employees..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select value={selectedEmployeeAdmin} onValueChange={setSelectedEmployeeAdmin}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an employee..." />
                      </SelectTrigger>
                      <SelectContent>
                        {namesData?.names?.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={handleRefreshList} disabled={isRefreshingList}>
                    <RotateCw className={`h-4 w-4 ${isRefreshingList ? "animate-spin" : ""}`} />
                  </Button>
                </div>

                {selectedEmployeeAdmin && (
                  <>
                    {adminHoursLoading ? (
                      <div className="flex items-center gap-2 py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-accent" />
                        <span className="text-muted-foreground">Loading...</span>
                      </div>
                    ) : adminHoursData?.success && adminHoursData?.data ? (
                      <div className="space-y-4 mt-2">
                        <div className="rounded-lg bg-accent/5 border border-accent/20 p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Total Hours ({MONTH_LABELS[selectedMonth!]})</p>
                            <p className="text-3xl font-bold text-accent">{adminHoursData.data.totalHours.toFixed(2)}</p>
                          </div>
                          <Clock className="h-10 w-10 text-accent/30" />
                        </div>
                        {adminHoursData.data.sources?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground">Hours by Source</p>
                            {adminHoursData.data.sources.map((source, idx) => (
                              <div key={idx} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-accent/60" />
                                  <div>
                                    <p className="text-sm font-medium">{source.sheetName}</p>
                                    <p className="text-xs text-muted-foreground">Box {source.boxNumber}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-accent">{source.hours.toFixed(2)} hrs</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="border-t border-border/50 pt-3">
                          <p className="text-xs text-muted-foreground mb-1">Employee</p>
                          <p className="text-base font-semibold">{selectedEmployeeAdmin}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-4 text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">No data available</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── EMPLOYEE DASHBOARD ───────────────────────────────────────────────
  if (mode === "employee-dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {MONTH_LABELS[selectedMonth!]} Hours
              </h1>
              <p className="text-sm text-muted-foreground mt-1">View your total working hours</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Hours Summary</CardTitle>
              <CardDescription>{MONTH_LABELS[selectedMonth!]} working hours breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {hoursLoading ? (
                <div className="flex items-center justify-center gap-2 py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  <span className="text-muted-foreground">Loading hours...</span>
                </div>
              ) : hoursData?.success && hoursData?.data ? (
                <div className="space-y-6">
                  <div className="rounded-lg bg-accent/5 border border-accent/20 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Total Hours ({MONTH_LABELS[selectedMonth!]})
                        </p>
                        <p className="text-4xl font-bold text-accent">
                          {hoursData.data.totalHours.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-12 w-12 text-accent/30" />
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={handleRefresh} disabled={isRefreshing}>
                          <RotateCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {hoursData.data.sources?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Hours by Source</p>
                      {hoursData.data.sources.map((source, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent/60" />
                            <div>
                              <p className="text-sm font-medium">{source.sheetName}</p>
                              <p className="text-xs text-muted-foreground">Box {source.boxNumber}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-accent">{source.hours.toFixed(2)} hrs</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Employee</p>
                    <p className="text-lg font-semibold text-foreground">{authedEmployee}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <span>No data available for this month</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground mt-6">
            Data updated from Google Sheets • {MONTH_LABELS[selectedMonth!]} only
          </div>
        </div>
      </div>
    );
  }

  return null;
}