import json
def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

file_path = 'test.json'

data = read_json_file(file_path)

for course in data["courses"]:
    print(f"Course Title: {course['course_title']}")
    print(f"Course Description: {course['course_description']}")
    print("Course Outcomes:")
    for outcome in course["course_outcome"]:
        print(f"  - {outcome}")
    
    for week, details in course["week"].items():
        print(f"\n{week.capitalize()}:")
        print("  Objectives:")
        for objective in details["objectives"]:
            print(f"    - {objective}")
        
        print("  Subtopics:")
        for subtopic in details["subtopics"]:
            print(f"    - {subtopic}")
        
        print("  Activities:")
        for activity in details["activities"]:
            print(f"    - {activity}")
        
        print("  Technologies Utilized:")
        for technology in details["technologies_utilized"]:
            print(f"    - {technology}")
