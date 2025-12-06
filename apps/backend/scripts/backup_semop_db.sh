#!/bin/bash

# ==============================================================================
# SEMOP ERP PostgreSQL Database Backup Script
# ==============================================================================
#
# This script performs a full backup of the specified PostgreSQL database using
# the custom format (-Fc), which is compressed and optimized for restoration.
# It also implements a retention policy to automatically delete old backups.
#
# ASSUMPTIONS:
# 1. The user running this script has the necessary permissions to connect to
#    the PostgreSQL database (e.g., via .pgpass file or environment variables).
# 2. The 'pg_dump' utility is available in the system's PATH.
# 3. The database name and user are configured below.
#
# ==============================================================================

# --- Configuration ---
DB_NAME="semop_erp_db"
DB_USER="semop_user"
BACKUP_DIR="/var/backups/postgresql/semop"
RETENTION_DAYS=7

# --- Pre-check ---
if ! command -v pg_dump &> /dev/null
then
    echo "Error: pg_dump command not found. Please ensure PostgreSQL client tools are installed."
    exit 1
fi

# Ensure the backup directory exists
mkdir -p $BACKUP_DIR

# --- Backup Process ---
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/$DB_NAME\_backup\_$TIMESTAMP.dump"

echo "Starting backup of database '$DB_NAME' to '$BACKUP_FILE'"

# Execute pg_dump using the custom format (-Fc)
# The custom format is compressed by default.
pg_dump -U $DB_USER -Fc $DB_NAME > $BACKUP_FILE

BACKUP_STATUS=$?

if [ $BACKUP_STATUS -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
else
    echo "Backup failed! pg_dump returned error code $BACKUP_STATUS"
    # Clean up failed backup file
    rm -f $BACKUP_FILE
    exit 1
fi

# --- Retention Policy ---
echo "Applying retention policy: Deleting backups older than $RETENTION_DAYS days..."

# Find and delete files older than RETENTION_DAYS in the backup directory
find $BACKUP_DIR -name "$DB_NAME\_backup\_*.dump" -type f -mtime +$RETENTION_DAYS -delete

echo "Retention policy applied. Backup process complete."

# --- Permissions ---
# Ensure only the owner can read/write the script and backups
chmod 700 $BACKUP_DIR
chmod 600 $BACKUP_FILE
chmod 700 $0 # Make the script executable only by the owner

exit 0
