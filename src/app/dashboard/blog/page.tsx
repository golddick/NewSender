import React from 'react'
import BlogListPage from './_component/DashboardBlog'
import { BlogManagement } from './_component/management/blog-management'

const page = () => {
  return (
    <div>
      {/* <BlogListPage/> */}
      <BlogManagement/>
    </div>
  )
}

export default page
