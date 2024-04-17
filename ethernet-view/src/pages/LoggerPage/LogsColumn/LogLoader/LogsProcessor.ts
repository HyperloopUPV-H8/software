import { UTCTimestamp } from 'lightweight-charts';
import Papa from 'papaparse';

/**
 * The function `processLoggerSession` reads CSV files from a directory, parses the data, filters out
 * invalid logs, and returns a map of file names to arrays of valid log entries with timestamps and
 * values.
 * @param {FileSystemDirectoryEntry} directory - The `directory` parameter in the
 * `processLoggerSession` function is expected to be a FileSystemDirectoryEntry object representing a
 * directory in the file system. This directory is used to retrieve files for processing in the
 * function.
 * @returns The `processLoggerSession` function returns a Promise that resolves to a Map<string, {time:
 * Date, value: number}[]> object. This map contains entries where the key is the name of a CSV file representing
 * a Measurement, and the value is an array of objects with a `time` property of type Date and
 * a `value` property of type number, representing an array of points with all the data
 * retrieved from the CSV file.
 */

export type ChartPoint = {time: UTCTimestamp, value: number};
export type Session = Map<string, ChartPoint[]>;

export async function extractLoggerSession (directory: FileSystemDirectoryEntry): Promise<Session> {
    const session: Session = new Map();
    const files = await getFilesFromDirectory(directory);
    if(files.length === 0) throw new Error("No files found in the directory.");
    
    for(const file of files) {
        try {
            if(!file.isFile) throw new Error(`Invalid entry ${file.name}. Expected a file.`);
            if(!file.name.endsWith(".csv")) throw new Error(`Invalid file ${file.name}. Expected a CSV file.`);
            (file as FileSystemFileEntry).file((file) => {
                Papa.parse(file, {
                    complete: (result) => {
                        const measurementPoints = [] as ChartPoint[];
                        for(const row of result.data) {
                            if(isValidLog(row)) {
                                const [timestamp, , , value] = row as [string, string, string, string];
                                measurementPoints.push({
                                    time: new Date(timestamp).getMilliseconds() as UTCTimestamp, 
                                    value: parseFloat(value)
                                });
                            }
                        }
                        session.set(file.name.replace(".csv", ""), measurementPoints);
                    },
                    error: (err) => {
                        throw new Error(`Error parsing file ${file.name}. ${err}`);
                    },
                    header: false
                });
            });
        } catch(err) {
            if(err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("An unexpected error occurred");
            }
        }
    };
    
    return session;
};

/**
 * The function `getFilesFromDirectory` asynchronously retrieves the entries (files and directories)
 * from a given directory in a file system.
 * @param {FileSystemDirectoryEntry} folder - FileSystemDirectoryEntry - Represents a directory in the
 * file system.
 * @returns The function `getFilesFromDirectory` returns a Promise that resolves to an array of
 * `FileSystemEntry` objects representing the files in the specified directory.
 */
export async function getFilesFromDirectory(folder: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
    const reader = folder.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
        reader.readEntries((entries) => {
            resolve(entries);
        }, (err) => {
            reject(err);
        });
    })
    return entries;
};


function isValidLog(row: unknown) {
    return (
        Array.isArray(row) &&
        row.length === 4 &&
        new Date(row[0]).toISOString() !== "Invalid Date" &&
        typeof row[1] === "string" &&
        typeof row[2] === "string" &&
        !isNaN(parseFloat(row[3]))
    );
}