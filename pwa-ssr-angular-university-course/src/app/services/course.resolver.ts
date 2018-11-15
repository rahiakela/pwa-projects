import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Course } from '../model/course';
import { CoursesService } from './courses.service';

@Injectable()
export class CourseResolver implements Resolve<Course> {
  constructor(
    private coursesService: CoursesService,
    @Inject(PLATFORM_ID) private platformId,
    private transferState: TransferState
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
    const courseId = route.params['id'];
    const COURSE_KEY = makeStateKey<Course>('course-' + courseId);

    if (this.transferState.hasKey(COURSE_KEY)) {
      const course = this.transferState.get<Course>(COURSE_KEY, null);
      this.transferState.remove(COURSE_KEY);

      return of(course);
    } else {
      return this.coursesService.findCourseById(courseId).pipe(
        tap(course => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(COURSE_KEY, course);
          }
        })
      );
    }
  }
}
