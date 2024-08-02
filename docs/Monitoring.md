# Project Monitoring Guide

Monitoring is a crucial aspect of maintaining the health and performance of applications in production. This guide covers the various methods implemented in this project to monitor logs and system metrics effectively.

## Overview

Effective monitoring helps in proactive issue detection, understanding application behavior, and optimizing performance. Our monitoring setup encompasses several layers including logs, performance metrics, and real-time alerting.

## 1. Log Monitoring

### 1.1 Accessing Logs

Logs provide insights into application behavior and are crucial for diagnosing problems. Here are the ways to access the logs:

#### 1.1.1 Local Logs

**Location:** Logs are stored in `/var/lib/docker/volumes/sterkbackend_logs_volume/_data`.
**Access:** Use SSH to access server logs directly. For example:

```bash
  tail -f /var/lib/docker/volumes/sterkbackend_logs_volume/_data/file.log
```

#### 1.1.2 Docker Logs

```
docker logs -f sterkBackend
```
