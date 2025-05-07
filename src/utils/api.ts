// File: utils/api.ts

/**
 * Save profile data to the API
 */
export async function saveProfile(username: string, data: any) {
    try {
      const response = await fetch(`/api/user/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }
  
  /**
   * Fetch profile data from the API
   */
  export async function fetchProfile(username: string) {
    try {
      const response = await fetch(`/api/user/${username}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
  
  /**
   * Save profile data to localStorage as backup
   */
  export function saveProfileToLocalStorage(data: any) {
    if (typeof window !== 'undefined') {
      try {
        // Save products
        if (data.products) {
          localStorage.setItem('addedProducts', JSON.stringify(data.products));
          sessionStorage.setItem('addedProducts', JSON.stringify(data.products));
        }
        
        // Save links
        if (data.links) {
          localStorage.setItem('addedLinks', JSON.stringify(data.links));
          sessionStorage.setItem('addedLinks', JSON.stringify(data.links));
        }
        
        // Save theme
        if (data.theme) {
          localStorage.setItem('profileTheme', JSON.stringify(data.theme));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }