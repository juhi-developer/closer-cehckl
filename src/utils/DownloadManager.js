let downloadQueue = [];
let activeDownloads = 0;
const MAX_CONCURRENT_DOWNLOADS = 1;

const processQueue = () => {
  while (
    activeDownloads < MAX_CONCURRENT_DOWNLOADS &&
    downloadQueue.length > 0
  ) {
    const task = downloadQueue.shift();
    activeDownloads++;

    task()
      .then(() => {
        activeDownloads--;
        processQueue(); // Check the queue for the next item after finishing one
      })
      .catch(error => {
        // console.error('Error in download task:', error);
        activeDownloads--;
        processQueue(); // Continue with the next item even if one fails
      });
  }
};

export const enqueueDownload = downloadTask => {
  downloadQueue.push(downloadTask);
  processQueue();
};
