import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Eye, EyeOff, Copy, RefreshCw, Info, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function ApiKeyManager() {
  const [apiKey, setApiKey] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchApiKey = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/company/api-key/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.ok) {
        setApiKey(data.api_key);
        setCreatedAt(data.created_at);
        // If we fetched a full key (not masked), cache it in localStorage for Axios requests
        if (data.api_key && !data.api_key.includes("***")) {
          localStorage.setItem("api_key", data.api_key);
        }
      } else {
        toast.error(data.error || "Failed to load API key");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading API key");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  const handleCopy = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy key");
    }
  };

  const handleRegenerate = async () => {
    const confirm = window.confirm("Are you sure? Old key will stop working immediately");
    if (!confirm) return;

    try {
      setRegenerating(true);
      const response = await fetch("http://localhost:8000/company/api-key/generate/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.ok) {
        setApiKey(data.api_key);
        setCreatedAt(data.created_at);
        // Cache new key in localStorage
        if (data.api_key) {
          localStorage.setItem("api_key", data.api_key);
        }
        toast.success("New API key generated successfully!");
      } else {
        toast.error(data.error || "Failed to regenerate API key");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during regeneration");
    } finally {
      setRegenerating(false);
    }
  };

  // Mask representation: sk_live_****abcd by default
  const getDisplayValue = () => {
    if (!apiKey) return "No key generated";
    if (showKey) return apiKey;
    const last4 = apiKey.slice(-4);
    return `sk_live_****${last4}`;
  };

  // Helper formatting for createdAt
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "Never";

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <RefreshCw className="animate-spin text-indigo-600 size-6" />
        <span className="ml-2 text-slate-600 font-medium">Fetching API key info...</span>
      </div>
    );
  }

  return (
    <Card className="shadow-lg border border-slate-100 rounded-2xl overflow-hidden bg-white max-w-2xl mx-auto">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Key className="size-5" />
          </div>
          <div className="text-left">
            <CardTitle className="text-xl font-bold text-slate-900">API Key</CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Use this key in App1/App2 backend requests
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 text-left">
            Secret Access Token
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={getDisplayValue()}
                readOnly
                className="pr-10 font-mono text-sm tracking-wide bg-slate-50 border-slate-200 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                disabled={!apiKey}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50 cursor-pointer"
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            
            <Button
              onClick={handleCopy}
              disabled={!apiKey}
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-4 h-10 cursor-pointer"
            >
              <Copy className="size-4 mr-1.5" />
              Copy
            </Button>
          </div>
          
          {createdAt && (
            <p className="text-xs text-slate-400 mt-2 flex items-center">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
              Last generated: <span className="font-semibold text-slate-600 ml-1">{formattedDate}</span>
            </p>
          )}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-semibold text-slate-900">Regenerate API Key</h4>
              <p className="text-xs text-slate-500">
                Instantly revoke your current API key and issue a new one.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="w-full sm:w-auto bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/70 py-2 px-4 rounded-lg cursor-pointer"
            >
              {regenerating ? (
                <>
                  <RefreshCw className="animate-spin size-4 mr-1.5" />
                  Regenerating...
                </>
              ) : (
                "Regenerate Key"
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-amber-850 text-left">
          <div className="p-1 text-amber-600">
            <Info className="size-5 shrink-0" />
          </div>
          <div className="space-y-1 text-sm text-amber-800 leading-relaxed">
            <p className="font-semibold text-amber-900">Developer Guidance</p>
            <p className="text-xs">
              Share this key with developers. Send as x-api-key header in all API requests.
            </p>
            <p className="text-xs font-semibold text-amber-900 flex items-center mt-2">
              <AlertTriangle className="size-3.5 mr-1 text-amber-600 shrink-0" />
              Warning: Regenerating invalidates the old key immediately.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
