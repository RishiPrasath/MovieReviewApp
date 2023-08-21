import requests
import os

url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    movie_data = response.json()
    for movie in movie_data.get('results', []):
        title = movie.get('title', 'N/A')
        poster_path = movie.get('poster_path')
        
        if poster_path:
            poster_url = f"https://image.tmdb.org/t/p/original/{poster_path}"
            poster_filename = f"{title}_poster.jpg"
            
            # Create the 'Posters' folder if it doesn't exist
            if not os.path.exists('Posters'):
                os.makedirs('Posters')
            
            poster_path = os.path.join('Posters', poster_filename)
            
            response = requests.get(poster_url)
            
            if response.status_code == 200:
                with open(poster_path, 'wb') as f:
                    f.write(response.content)
                print(f"Downloaded and saved poster for '{title}' as '{poster_filename}'")
            else:
                print(f"Error downloading poster for '{title}': {response.status_code}")
        else:
            print(f"No poster available for '{title}'")
            
        print("-----------")
else:
    print(f"Error: {response.status_code}")
