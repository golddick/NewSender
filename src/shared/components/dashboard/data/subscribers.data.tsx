

'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import useSubscribersData from "@/shared/hooks/useSubscribersData";
import { format } from "timeago.js";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { getCategoryByOwnerId } from "@/actions/get.category";

type Subscriber = {
  email: string;
  newsLetterOwnerId: string;
  source: string;
  status: string;
  category: string;
};

const SubscribersData = () => {
  const { data, loading, refetch } = useSubscribersData();
  const { user } = useUser();

  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string | null>(null); 

  const newsLetterOwnerId = user?.id;

  console.log(data, "Data from subscribers data");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!newsLetterOwnerId) throw new Error("Newsletter owner ID is undefined.");
        const res = await getCategoryByOwnerId({ newsLetterOwnerId });

        if (Array.isArray(res) && res.length > 0) {
          setCategories(res);
          setSelectedCategory(res[0]._id); 
          setCategoryName(res[0].name); 
        } else {
          toast.warning("No categories found. Please create one.");
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      }
    };

    if (user) fetchCategories();
  }, [user, newsLetterOwnerId]);

  if (!newsLetterOwnerId) {
    toast.error("No newsletter owner ID found for the logged-in user.");
    return null;
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    toast.info("Processing CSV file...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        try {
          const parsed = results.data.map((row: any) => ({
            email: row.email.toLowerCase().trim(),
            newsLetterOwnerId,
            source: row.source || "CSV Import",
            status: row.status || "Subscribed",
            category: setCategoryName || null,
            metadata: {
              campaign: row.campaign || null,
              pageUrl: "CSV Import",
              formId: "csv_upload_form"
            }
          }));

          const emailSet = new Set();
          const csvDuplicates = parsed.filter((subscriber: Subscriber) => {
            if (emailSet.has(subscriber.email)) return true;
            emailSet.add(subscriber.email);
            return false;
          });

          if (csvDuplicates.length > 0) {
            toast.error(`CSV contains ${csvDuplicates.length} duplicate emails.`);
            setError(`Duplicate emails in file.`);
            setErrorDetails(`Examples: ${csvDuplicates.slice(0, 3).map((d: Subscriber) => d.email).join(", ")}`);
            return;
          }

          toast.info("Importing subscribers...");
          const res = await axios.post("/api/import", { subscribers: parsed });

          if (res.data.success) {
            toast.success(`Imported ${res.data.count} subscribers`, {
              action: {
                label: "View",
                onClick: () => refetch(),
              },
            });

            if (res.data.duplicates?.length > 0) {
              toast.warning(`${res.data.duplicates.length} duplicate emails found`, {
                description: res.data.duplicates.slice(0, 3).join(", ") + (res.data.duplicates.length > 3 ? "..." : ""),
              });
            }

            setError(null);
            setErrorDetails(null);
            await refetch();
          } else {
            toast.error(res.data.error || "Import failed", {
              description: res.data.details || "Check CSV",
            });
            setError(res.data.error);
            setErrorDetails(res.data.details);
          }
        } catch (err: any) {
          toast.error("Import failed", { description: err.message });
          setError(err.message);
        } finally {
          setIsImporting(false);
          if (e.target) e.target.value = '';
        }
      },
      error: (error: any) => {
        setIsImporting(false);
        toast.error("CSV parsing failed", { description: error.message });
      }
    });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.8 },
    { field: "createdAt", headerName: "Subscribed At", flex: 0.5 },
    { field: "source", headerName: "Source", flex: 0.5 },
    { field: "category", headerName: "Category", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params: any) => <span>{params.row.status}</span>,
    },
  ];

  console.log("Rows data:", data);
  console.log("Categories data:", categories);
  console.log("Selected category:", selectedCategory);
  console.log("Category name:", categoryName);

  const rows = data?.map((i: any) => ({
    id: i._id,
    email: i.email,
    createdAt: format(i.createdAt),
    source: i.source,
    status: i.status,
    category:i.category
  })) || [];

  return (
    <Box m="20px">
     

      {/* Upload button */}
      <Box mb={2}>
        <div className="flex justify-between items-center w-full gap-8 p-2">

        <Button
          variant="contained"
          component="label"
          color="error"
          disabled={isImporting}
          >
          {isImporting ? "Importing..." : "Import CSV File"}
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleCSVUpload}
            disabled={isImporting}
            />
        </Button>


         {/* Category dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }} className=" border-none">
        <InputLabel id="category-label">Select Category</InputLabel>
        <Select
          labelId="category-label"
          value={selectedCategory}
          label="Select Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
            </div>
        {error && <p className="mt-2" style={{ color: "red" }}>{error}</p>}
        {errorDetails && <p className="mt-2" style={{ color: "red" }}>{errorDetails}</p>}
      </Box>

      {/* Data Table */}
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#A4A9FC",
            color: "#000",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#B91C1C",
            color: "#fff",
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} loading={loading || isImporting} />
      </Box>
    </Box>
  );
};

export default SubscribersData;
