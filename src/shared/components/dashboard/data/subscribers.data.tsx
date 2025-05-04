

'use client';

import { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import useSubscribersData from "@/shared/hooks/useSubscribersData";
import { format } from "timeago.js";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type Subscriber = {
  email: string;
  newsLetterOwnerId: string;
  source: string;
  status: string;
};

const SubscribersData = () => {
  const { data, loading, refetch } = useSubscribersData();
  const { user } = useUser();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Get the logged-in user's newsletterOwnerId (Clerk user ID)
  const newsletterOwnerId = user?.id;

  if (!newsletterOwnerId) {
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
            email: row.email,
            newsLetterOwnerId : newsletterOwnerId,
            source: row.source || "CSV Import",
            status: row.status || "Subscribed",
          }));

          // Validate emails in the CSV first
          const emailSet = new Set();
            const csvDuplicates = parsed.filter((subscriber: Subscriber) => {
            const emailKey: string = subscriber.email.toLowerCase().trim();
            if (emailSet.has(emailKey)) return true;
            emailSet.add(emailKey);
            return false;
            });

            console.log("CSV Duplicates:", csvDuplicates);
            console.log("Parsed CSV Data:", parsed);
            

          if (csvDuplicates.length > 0) {
            // toast.error(
            //   `CSV contains ${csvDuplicates.length} duplicate emails. Please fix before importing.`,
            //   {
            //   description: `Duplicates: ${csvDuplicates.slice(0, 3).map((d: Subscriber) => d.email).join(', ')}${csvDuplicates.length > 3 ? '...' : ''}`
            //   }
            // );
            toast.error('error')
            setError(`CSV contains ${csvDuplicates.length} duplicate emails. Please fix before importing.`);
            setErrorDetails(`Duplicates: ${csvDuplicates.slice(0, 3).map((d: Subscriber) => d.email).join(', ')}${csvDuplicates.length > 3 ? '...' : ''}`);
            return;
          }

          toast.info("Importing subscribers...");
          const res = await axios.post("/api/import", { subscribers: parsed });
          console.log("CSV Import Response:", res.data);

          if (res.status === 200) {
            if (res.data.success) {
              const successMsg = res.data.duplicateCount > 0
                ? `Imported ${res.data.createdCount} subscribers (${res.data.duplicateCount} duplicates skipped)`
                : `Successfully imported ${res.data.createdCount} subscribers`;
              
              toast.success(successMsg, {
                action: {
                  label: 'View',
                  onClick: () => refetch()
                }
              });

              if (res.data.duplicates && res.data.duplicates.length > 0) {
                toast.warning(
                  `${res.data.duplicates.length} duplicate emails found in database`,
                  {
                    description: `Existing emails: ${res.data.duplicates.slice(0, 3).join(', ')}${res.data.duplicates.length > 3 ? '...' : ''}`
                  }
                );
              }

              await refetch();
            } else if (res.data.error) {
              toast.error(res.data.error, {
                description: res.data.details || 'Please check your CSV file'
              });
              setError(res.data.error);
              setErrorDetails(res.data.details || 'Please check your CSV file');
            }
          }
        } catch (err: any) {
          console.error("CSV Import Failed:", err);
          
          if (err.response) {
            const { data } = err.response;
            if (data.error === "Some emails already exist" && data.duplicates) {
              toast.error(
                `${data.count} duplicate emails found in database`,
                {
                  description: `Existing emails: ${data.duplicates.slice(0, 3).join(', ')}${data.duplicates.length > 3 ? '...' : ''}`
                }
              );
              setError(data.error);
              setErrorDetails(`Existing emails ${data.duplicateCount}: ${data.duplicates.slice(0, 3).join(', ')}${data.duplicates.length > 3 ? '...' : ''}`);
            } else {
              toast.error(data.error || "Import failed", {
                description: data.details || 'Please try again'
              });
              setError(data.error || 'Import failed');
              setErrorDetails(`Existing emails ${data.duplicateCount}: ${data.duplicates.slice(0, 3).join(', ')}${data.duplicates.length > 3 ? '...' : ''}`);
            }
          } else {
            toast.error("Import failed", {
              description: err.message || 'An unknown error occurred'
            });
            setError(err.message || 'An unknown error occurred');
          }
        } finally {
          setIsImporting(false);
          // Reset input
          if (e.target) e.target.value = '';
        }
      },
      error: (error: any) => {
        setIsImporting(false);
        toast.error("CSV parsing failed", {
          description: error.message || 'Invalid CSV format'
        });
      }
    });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.8 },
    { field: "createdAt", headerName: "Subscribed At", flex: 0.5 },
    { field: "source", headerName: "Source", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params: any) => <h1>{params.row.status}</h1>,
    },
  ];

  const rows = data?.map((i: any) => ({
    id: i._id,
    email: i.email,
    createdAt: format(i.createdAt),
    source: i.source,
    status: i.status,
  })) || [];

  return (
    <Box m="20px">
      <Box mb={2}>
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
        {error && <p className=" mt-2" style={{ color: 'red' }}>{error}</p>}
        {errorDetails && <p className=" mt-2" style={{ color: 'red' }}>{errorDetails}</p>}
      </Box>

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