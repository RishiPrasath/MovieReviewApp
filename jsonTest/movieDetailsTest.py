import requests

def get_movie_details(movie_id):
    
    #Initialize variables for movie details

    title = ""
    release_date = ""
    poster_path = ""
    genres = []
    cast = []
    directors = []
    
    base_url = "https://api.themoviedb.org/3"
    api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk"  # Replace with your actual API key

    # Define headers
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    # Get movie details
    movie_url = f"{base_url}/movie/{movie_id}"
    response = requests.get(movie_url, headers=headers)

    

    # Print movie title
    if response.status_code == 200:
        movie_data = response.json()
        print("Movie details retrieved successfully.")

        # Extract relevant fields
        title = movie_data.get("title")
        release_date = movie_data.get("release_date")
        poster_path = movie_data.get("poster_path")
        genres = []    
        for genre in movie_data.get("genres"):
            # print(genre.get("name"))
            genres.append(genre.get("name"))

        

        # Print retrieved fields
        print(f"Title: {title}")
        print(f"Release Date: {release_date}")
        print(f"Poster Path: {poster_path}")
        print(f"Genres: {genres}")
        
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk"
    }

    response = requests.get(url, headers=headers)

    castandcrew = response.json()
    
    cast_members = castandcrew.get("cast")
    crew_members = castandcrew.get("crew")

    #Limit cast to 5 members
    for i in range(5):
        cast.append(cast_members[i].get("name"))


    print(f"Cast: {cast}")

    #Get director
    for crew_member in crew_members:
        if crew_member.get("job") == "Director":
            directors.append(crew_member.get("name"))

    print(f"Directors: {directors}")

    # construct movie details dictionary
    movie_details = {
        "title": title,
        "release_date": release_date,
        "poster_path": poster_path,
        "genres": genres,
        "cast": cast,
        "directors": directors
    }

    return movie_details




# Test get_movie_details() function

movie_id_list=[]

import requests

url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:

    popular_movies = response.json()

    list_of_movies = popular_movies.get("results")

    for movie in list_of_movies:
        movie_id_list.append(movie.get("id"))





# Test get_movie_details() function

movie_result_data = []

for movie_id in movie_id_list:
    movie_details = get_movie_details(movie_id)
    movie_result_data.append(movie_details)
    print("\n\n\n")

    # Download and save poster
    import random
    import os
    poster_url = f"https://image.tmdb.org/t/p/w400/{movie_details['poster_path'].lstrip('/')}"
    print(f"Downloading poster from: {poster_url}")
    poster_response = requests.get(poster_url)
    
    if poster_response.status_code == 200:
        poster_content = poster_response.content
        poster_filename = f"Posters/{random.randint(1000, 9999)}_poster.jpg"
        
        with open(poster_filename, 'wb') as poster_file:
            poster_file.write(poster_content)
            
        print(f"Poster saved: {poster_filename}")
    else:
        print("Failed to download poster.")

#Write to json file

import json

with open('movie_details.json', 'w') as json_file:
    json.dump(movie_result_data, json_file)

print("Movie details written to json file successfully.")


