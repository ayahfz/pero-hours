import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Clock, AlertCircle, CheckCircle2, RotateCw, Lock, Users, LogOut, ChevronLeft, Building2 } from "lucide-react";

type Month = "feb" | "mar" | "apr" | "may";
type Brand = "pero" | "oneforma";
type Mode = "brand-select" | "month-select" | "admin-login" | "admin-dashboard" | "employee-login" | "employee-dashboard";

const BRAND_LABELS: Record<Brand, string> = { pero: "Pero", oneforma: "Oneforma" };
const MONTH_LABELS: Record<Month, string> = { 
  feb: "February", 
  mar: "March", 
  apr: "April",
  may: "May"  // ✅ تمت الإضافة
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("brand-select");
  const [brand, setBrand] = useState<Brand | null>(null);
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
  const [refreshingEmployee, setRefreshingEmployee] = useState<string | null>(null);

  const verifyAdmin = trpc.employee.verifyAdmin.useMutation();
  const verifyEmployee = trpc.employee.verifyEmployee.useMutation();

  const hasCodeQuery = trpc.employee.hasCode.useQuery(
    { name: employeeName, brand: brand! },
    { enabled: !!employeeName && !!brand && mode === "employee-login" }
  );

  const { data: namesData, isLoading: namesLoading, refetch: refetchNames } = trpc.employee.listNames.useQuery(
    { month: selectedMonth!, brand: brand! },
    { enabled: !!selectedMonth && !!brand && (mode === "employee-login" || mode === "admin-dashboard") }
  );

  const { data: hoursData, isLoading: hoursLoading, refetch: refetchHours } = trpc.employee.getHours.useQuery(
    { name: authedEmployee, month: selectedMonth!, brand: brand! },
    { enabled: !!authedEmployee && !!selectedMonth && !!brand && mode === "employee-dashboard" }
  );

  const { data: adminHoursData, isLoading: adminHoursLoading, refetch: refetchAdminHours } = trpc.employee.getHours.useQuery(
    { name: selectedEmployeeAdmin, month: selectedMonth!, brand: brand! },
    { enabled: !!selectedEmployeeAdmin && !!selectedMonth && !!brand && mode === "admin-dashboard" }
  );

  const { data: allHoursData, isLoading: allHoursLoading, refetch: refetchAllHours } = trpc.employee.getAllHours.useQuery(
    { month: selectedMonth!, brand: brand! },
    { enabled: !!selectedMonth && !!brand && mode === "admin-dashboard" }
  );

  const handleSelectBrand = (b: Brand) => { setBrand(b); setMode("month-select"); };
  const handleSelectMonth = (month: Month) => { setSelectedMonth(month); setMode("home"); };

  const handleAdminLogin = async () => {
    setAdminError("");
    const result = await verifyAdmin.mutateAsync({ code: adminCode });
    result.success ? setMode("admin-dashboard") : setAdminError("Wrong code");
  };

  const handleEmployeeLogin = async () => {
    setEmployeeError("");
    const result = await verifyEmployee.mutateAsync({ name: employeeName, code: employeeCode, brand: brand! });
    if (result.success) { setAuthedEmployee(employeeName); setMode("employee-dashboard"); } 
    else { setEmployeeError("Wrong code | Don't have a code yet? Message us"); }
  };

  const handleLogout = () => {
    setMode("brand-select"); setBrand(null); setSelectedMonth(null);
    setAdminCode(""); setAdminError(""); setEmployeeName(""); setEmployeeCode("");
    setEmployeeError(""); setAuthedEmployee(""); setSelectedEmployeeAdmin("");
  };

  const handleRefresh = async () => { setIsRefreshing(true); try { await refetchHours(); } finally { setIsRefreshing(false); } };
  
  const handleRefreshList = async () => {
    setIsRefreshingList(true);
    try {
      await Promise.all([refetchNames(), refetchAllHours()]);
    } finally {
      setIsRefreshingList(false);
    }
  };
  
  const handleRefreshEmployeeHours = async (employeeName: string) => {
    setRefreshingEmployee(employeeName);
    try { await refetchAdminHours(); } finally { setRefreshingEmployee(null); }
  };

  const showNoCodeMessage = employeeName && hasCodeQuery.data && !hasCodeQuery.data.hasCode;

  // ─── 1. BRAND SELECT ─────────────────────────────────────────────────
  if (mode === "brand-select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Hours Portal</h1>
            <p className="text-muted-foreground">Select your platform</p>
          </div>
          <div className="space-y-4">
            {(["pero", "oneforma"] as Brand[]).map((b) => (
              <button 
                key={b} 
                onClick={() => handleSelectBrand(b)}
                className={`w-full p-6 rounded-2xl border transition-all duration-300 text-center group hover:-translate-y-1 active:scale-95 ${
                  b === "pero" 
                    ? "border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:shadow-lg hover:shadow-blue-500/10" 
                    : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:shadow-lg hover:shadow-emerald-500/10"
                }`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                  b === "pero" ? "bg-blue-500/20 text-blue-600" : "bg-emerald-500/20 text-emerald-600"
                }`}>
                  <Building2 className="h-7 w-7" />
                </div>
                <p className={`text-xl font-bold mb-1 transition-colors ${
                  b === "pero" ? "text-blue-700 group-hover:text-blue-600" : "text-emerald-700 group-hover:text-emerald-600"
                }`}>
                  {BRAND_LABELS[b]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {b === "pero" ? "Feb • Mar • Apr • May" : "Apr • May"}  {/* ✅ تم التعديل */}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. MONTH SELECT ─────────────────────────────────────────────────
  if (mode === "month-select") {
    const months: Month[] = brand === "oneforma" ? ["apr", "may"] : ["feb", "mar", "apr", "may"];
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{BRAND_LABELS[brand!]} Hours</h1>
            <p className="text-muted-foreground">Select a month</p>
          </div>
          <div className="space-y-3">
            {months.map((month) => (
              <button key={month} onClick={() => handleSelectMonth(month)}
                className="w-full p-5 rounded-xl border border-border/50 bg-card hover:bg-accent/5 hover:border-accent/30 transition-all text-left group">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">{MONTH_LABELS[month]}</span>
                  <ChevronLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:text-accent transition-colors" />
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => { setMode("brand-select"); setBrand(null); }}
            className="mt-6 w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to platforms
          </button>
        </div>
      </div>
    );
  }

  // ─── 3. MODE SELECT (Admin/Employee) ─────────────────────────────────
  if (mode === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{MONTH_LABELS[selectedMonth!]} Hours</h1>
            <p className="text-muted-foreground">{BRAND_LABELS[brand!]} • Secure Access</p>
          </div>
          <div className="space-y-3">
            <button onClick={() => setMode("admin-login")}
              className="w-full p-6 rounded-xl border border-border/50 bg-card hover:bg-accent/5 hover:border-accent/30 transition-all text-center group">
              <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
              <p className="text-lg font-semibold text-foreground">Admin Mode</p>
            </button>
            <button onClick={() => setMode("employee-login")}
              className="w-full p-6 rounded-xl border border-border/50 bg-card hover:bg-accent/5 hover:border-accent/30 transition-all text-center group">
              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
              <p className="text-lg font-semibold text-foreground">Employee Mode</p>
            </button>
          </div>
          <button onClick={() => { setMode("month-select"); setSelectedMonth(null); }}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to months
          </button>
        </div>
      </div>
    );
  }

  // ─── 4. ADMIN LOGIN ──────────────────────────────────────────────────
  if (mode === "admin-login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2"><Lock className="h-5 w-5 text-accent" /><CardTitle>Admin Access</CardTitle></div>
              <CardDescription>Enter the admin code to view all employee data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Admin Code</Label>
                <Input type="password" placeholder="Enter admin code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()} />
              </div>
              {adminError && <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive"><AlertCircle className="h-4 w-4" /><p className="text-sm font-medium">{adminError}</p></div>}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode("home")} className="flex-1">Back</Button>
                <Button onClick={handleAdminLogin} disabled={!adminCode || verifyAdmin.isPending} className="flex-1">{verifyAdmin.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Access"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── 5. EMPLOYEE LOGIN ───────────────────────────────────────────────
  if (mode === "employee-login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /><CardTitle>Employee Access</CardTitle></div>
              <CardDescription>Select your name and enter your personal code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between"><Label>Select Your Name</Label>
                  <button onClick={handleRefreshList} disabled={isRefreshingList || namesLoading}><RotateCw className={`h-4 w-4 text-muted-foreground hover:text-foreground ${isRefreshingList ? "animate-spin" : ""}`} /></button>
                </div>
                {namesLoading ? (<div className="flex items-center gap-2 py-2"><Loader2 className="h-4 w-4 animate-spin text-accent" /><span className="text-sm text-muted-foreground">Loading...</span></div>) : (
                  <Select value={employeeName} onValueChange={setEmployeeName}>
                    <SelectTrigger><SelectValue placeholder="Choose your name..." /></SelectTrigger>
                    <SelectContent>{namesData?.names?.map((name) => (<SelectItem key={name} value={name}>{name}</SelectItem>))}</SelectContent>
                  </Select>
                )}
              </div>
              {showNoCodeMessage && (
                <div className="flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-400">Don't have a code yet? Message us now{" "}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Your Code</Label>
                <Input type="password" placeholder="Enter your personal code" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleEmployeeLogin()} />
              </div>
              {employeeError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive"><AlertCircle className="h-4 w-4" /><p className="text-sm font-medium">{employeeError}</p></div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode("home")} className="flex-1">Back</Button>
                <Button onClick={handleEmployeeLogin} disabled={!employeeName || !employeeCode || verifyEmployee.isPending} className="flex-1">{verifyEmployee.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Access"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── 6. ADMIN DASHBOARD ──────────────────────────────────────────────
  if (mode === "admin-dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div><h1 className="text-3xl font-bold tracking-tight text-foreground">{MONTH_LABELS[selectedMonth!]} Hours</h1><p className="text-sm text-accent font-medium mt-1">{BRAND_LABELS[brand!]} • Admin Mode</p></div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" /> Logout</Button>
          </div>
          <div className="space-y-6">
            {/* Total Hours Summary - بدون زر Refresh */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader><CardTitle>Total Hours Summary</CardTitle><CardDescription>All employees aggregate hours for {MONTH_LABELS[selectedMonth!]}</CardDescription></CardHeader>
              <CardContent>
                {allHoursLoading ? (<div className="flex items-center gap-2 py-4"><Loader2 className="h-5 w-5 animate-spin text-accent" /><span className="text-muted-foreground">Loading...</span></div>) : (
                  <div className="rounded-lg bg-accent/5 border border-accent/20 p-6 flex items-center justify-between">
                    <div><p className="text-sm font-medium text-muted-foreground mb-1">Total Hours (All Employees)</p><p className="text-4xl font-bold text-accent">{allHoursData?.totalHours?.toFixed(2) ?? "0"}</p><p className="text-sm text-muted-foreground mt-1">{allHoursData?.count ?? 0} employees</p></div>
                    <Clock className="h-12 w-12 text-accent/30" />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm">
              <CardHeader><CardTitle>Select Employee</CardTitle><CardDescription>{namesData?.names?.length ? `${namesData.names.length} employees found` : namesLoading ? "Loading employees..." : "No employees found"}</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    {namesLoading ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      </div>
                    ) : (
                      <Select value={selectedEmployeeAdmin} onValueChange={setSelectedEmployeeAdmin}>
                        <SelectTrigger><SelectValue placeholder="Choose an employee..." /></SelectTrigger>
                        <SelectContent>
                          {namesData?.names?.map((name) => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={handleRefreshList} disabled={isRefreshingList}>
                    <RotateCw className={`h-4 w-4 ${isRefreshingList ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                {selectedEmployeeAdmin && (
                  <>
                    {adminHoursLoading ? (<div className="flex items-center gap-2 py-4"><Loader2 className="h-5 w-5 animate-spin text-accent" /><span className="text-muted-foreground">Loading...</span></div>) : adminHoursData?.success && adminHoursData?.data ? (
                      <div className="space-y-4 mt-2">
                        {/* ✅ زر Refresh هنا عند Total Hours للموظف */}
                        <div className="rounded-lg bg-accent/5 border border-accent/20 p-4 flex items-center justify-between">
                          <div><p className="text-sm font-medium text-muted-foreground mb-1">Total Hours ({MONTH_LABELS[selectedMonth!]})</p><p className="text-3xl font-bold text-accent">{adminHoursData.data.totalHours.toFixed(2)}</p></div>
                          <div className="flex items-center gap-3">
                            <Clock className="h-10 w-10 text-accent/30" />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-10 w-10 p-0"
                              onClick={() => handleRefreshEmployeeHours(selectedEmployeeAdmin)}
                              disabled={refreshingEmployee === selectedEmployeeAdmin}
                            >
                              <RotateCw className={`h-5 w-5 ${refreshingEmployee === selectedEmployeeAdmin ? "animate-spin" : ""}`} />
                            </Button>
                          </div>
                        </div>
                        {adminHoursData.data.sources?.length > 0 && (
                          <div className="space-y-2"><p className="text-sm font-semibold text-foreground">Hours by Source</p>
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
                        <div className="border-t border-border/50 pt-3"><p className="text-xs text-muted-foreground mb-1">Employee</p><p className="text-base font-semibold">{selectedEmployeeAdmin}</p></div>
                      </div>
                    ) : (<div className="flex items-center gap-2 py-4 text-muted-foreground"><AlertCircle className="h-4 w-4" /><span className="text-sm">No data available</span></div>)}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ─── 7. EMPLOYEE DASHBOARD ───────────────────────────────────────────
  if (mode === "employee-dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div><h1 className="text-3xl font-bold tracking-tight text-foreground">{MONTH_LABELS[selectedMonth!]} Hours</h1><p className="text-sm text-muted-foreground mt-1">{BRAND_LABELS[brand!]} • View your total working hours</p></div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" /> Logout</Button>
          </div>
          <Card className="border-border/50 shadow-sm">
            <CardHeader><CardTitle>Hours Summary</CardTitle><CardDescription>{MONTH_LABELS[selectedMonth!]} working hours breakdown</CardDescription></CardHeader>
            <CardContent>
              {hoursLoading ? (<div className="flex items-center justify-center gap-2 py-8"><Loader2 className="h-5 w-5 animate-spin text-accent" /><span className="text-muted-foreground">Loading hours...</span></div>) : hoursData?.success && hoursData?.data ? (
                <div className="space-y-6">
                  <div className="rounded-lg bg-accent/5 border border-accent/20 p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-muted-foreground mb-1">Total Hours ({MONTH_LABELS[selectedMonth!]})</p><p className="text-4xl font-bold text-accent">{hoursData.data.totalHours.toFixed(2)}</p></div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-12 w-12 text-accent/30" />
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={handleRefresh} disabled={isRefreshing}>
                          <RotateCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {hoursData.data.sources?.length > 0 && (
                    <div className="space-y-2"><p className="text-sm font-semibold text-foreground">Hours by Source</p>
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
                  <div className="border-t border-border/50 pt-4"><p className="text-xs text-muted-foreground mb-1">Employee</p><p className="text-lg font-semibold text-foreground">{authedEmployee}</p></div>
                </div>
              ) : (<div className="flex items-center justify-center gap-2 py-8 text-muted-foreground"><AlertCircle className="h-5 w-5" /><span>No data available for this month</span></div>)}
            </CardContent>
          </Card>
          <div className="text-center text-xs text-muted-foreground mt-6">Data updated from Google Sheets • {MONTH_LABELS[selectedMonth!]} only</div>
        </div>
      </div>
    );
  }

  return null;
}