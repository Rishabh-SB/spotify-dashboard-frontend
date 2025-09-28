// Data utility functions for processing Spotify analytics data

export const processTopEntities = (data) => {
  const section1 = data?.section1 || {};
  const { top_songs = {}, top_artists = {}, top_albums = {} } = section1;
  
  return {
    topSongs: Object.entries(top_songs).map(([name, playtime]) => ({
      name: name.length > 30 ? name.substring(0, 30) + '...' : name,
      fullName: name,
      playtime: Math.round(playtime / 1000 / 60), // Convert to minutes
      playtimeMs: playtime
    })),
    topArtists: Object.entries(top_artists).map(([name, playtime]) => ({
      name: name.length > 25 ? name.substring(0, 25) + '...' : name,
      fullName: name,
      playtime: Math.round(playtime / 1000 / 60), // Convert to minutes
      playtimeMs: playtime
    })),
    topAlbums: Object.entries(top_albums).map(([name, playtime]) => ({
      name: name.length > 30 ? name.substring(0, 30) + '...' : name,
      fullName: name,
      playtime: Math.round(playtime / 1000 / 60), // Convert to minutes
      playtimeMs: playtime
    }))
  };
};

export const processTimeBasedData = (data) => {
  const section2 = data?.section2 || {};
  const { daily_hours = {}, weekly_hours = {}, monthly_hours = {}, hour_minutes = {}, weekday_minutes = {} } = section2;
  
  return {
    dailyHours: Object.entries(daily_hours).map(([date, hours]) => ({
      date,
      hours: Math.round(hours * 100) / 100
    })),
    weeklyHours: Object.entries(weekly_hours).map(([week, hours]) => ({
      week,
      hours: Math.round(hours * 100) / 100
    })),
    monthlyHours: Object.entries(monthly_hours).map(([month, hours]) => ({
      month,
      hours: Math.round(hours * 100) / 100
    })),
    hourlyMinutes: Object.entries(hour_minutes).map(([hour, minutes]) => ({
      hour: parseInt(hour),
      minutes: Math.round(minutes)
    })),
    weekdayMinutes: Object.entries(weekday_minutes).map(([day, minutes]) => ({
      day,
      minutes: Math.round(minutes)
    }))
  };
};

export const processUserBehaviorData = (data) => {
  const section3 = data?.section3 || {};
  const { 
    skip_rate = 0, 
    loyalty = 0, 
    new_tracks = 0, 
    new_artists = 0, 
    top_streaks = {}, 
    ms_played_histogram = {}, 
    loyalty_pie_tracks = {}, 
    loyalty_pie_artists = {}, 
    new_artists_per_month = {}, 
    new_tracks_per_month = {}, 
  } = section3;
  
  return {
    skipRate: Math.round(skip_rate * 100),
    loyaltyMetric: Math.round(loyalty * 100),
    newTracksCount: new_tracks,
    newArtistsCount: new_artists,
    topStreaks: (top_streaks || []).map(item => ({
        track: item.track.length > 25 ? item.track.substring(0, 25) + '...' : item.track,
        fullTrack: item.track,
        count: item.streak
      })),
      trackPlaytimeHistogram: Object.entries(ms_played_histogram || {}).map(([range, count]) => ({
        range,
        count
      })),
    loyaltyPieCharts: {
      topTracks: Object.entries(loyalty_pie_tracks).map(([category, value]) => ({
        category,
        value: Math.round(value * 100) / 100
      })),
      topArtists: Object.entries(loyalty_pie_artists).map(([category, value]) => ({
        category,
        value: Math.round(value * 100) / 100
      }))
    },
    explorationCharts: {
      newArtistsPerMonth: Object.entries(new_artists_per_month).map(([month, count]) => ({
        month,
        count
      })),
      newTracksPerMonth: Object.entries(new_tracks_per_month).map(([month, count]) => ({
        month,
        count
      }))
    }
  };
};

export const processPlatformData = (data) => {
  const section4 = data?.section4 || {};
  const { platform_percent = {}, platform_over_time = {} } = section4;
  
  return {
    platformPercentages: Object.entries(platform_percent).map(([platform, percentage]) => ({
      platform,
      percentage: Math.round(percentage * 10000) / 100
    })),
    platformUsageOverTime: Object.entries(platform_over_time).map(([date, platforms]) => ({
      date,
      ...Object.fromEntries(
        Object.entries(platforms || {}).map(([platform, hours]) => [
          platform,
          Math.round(hours * 100) / 100
        ])
      )
    }))
  };
};

export const processSessionData = (data) => {
  const section5 = data?.section5 || {};
  const { 
    total_sessions = 0, 
    average_session_duration_minutes = 0, 
    session_length_histogram = {}, 
    average_tracks_per_session = 0 
  } = section5;
  
  return {
    totalSessions: total_sessions,
    avgSessionDuration: Math.round(average_session_duration_minutes * 100) / 100,
    sessionLengthHistogram: Object.entries(session_length_histogram).map(([range, count]) => ({
      range,
      count
    })),
    avgTracksPerSession: Math.round(average_tracks_per_session * 100) / 100
  };
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatPlaytime = (playtimeMs) => {
  const minutes = Math.round(playtimeMs / 1000 / 60);
  return formatDuration(minutes);
};
