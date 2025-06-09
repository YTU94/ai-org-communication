"use client"

import { useMemo } from "react"
import type { Employee } from "../../lib/db"

interface OrgChartProps {
  employees: Employee[]
}

interface TreeNode {
  employee: Employee
  children: TreeNode[]
}

export function OrgChart({ employees }: OrgChartProps) {
  const orgTree = useMemo(() => {
    const employeeMap = new Map<string, Employee>()
    employees.forEach((emp) => employeeMap.set(emp.id, emp))

    const buildTree = (managerId?: string): TreeNode[] => {
      return employees
        .filter((emp) => emp.managerId === managerId)
        .map((emp) => ({
          employee: emp,
          children: buildTree(emp.id),
        }))
    }

    return buildTree()
  }, [employees])

  const renderNode = (node: TreeNode, level = 0) => (
    <div key={node.employee.id} className="flex flex-col items-center">
      <div
        className={`
          bg-white border-2 border-blue-200 rounded-lg p-4 m-2 shadow-md
          hover:shadow-lg transition-shadow cursor-pointer
          ${level === 0 ? "border-blue-500 bg-blue-50" : ""}
        `}
        style={{ marginLeft: level * 20 }}
      >
        <div className="text-center">
          <h3 className="font-semibold text-gray-800">{node.employee.name}</h3>
          <p className="text-sm text-gray-600">{node.employee.position}</p>
          <p className="text-xs text-gray-500">{node.employee.department}</p>
          <div className="mt-2">
            <p className="text-xs text-gray-400">Level {node.employee.level}</p>
          </div>
        </div>
      </div>

      {node.children.length > 0 && (
        <div className="flex flex-wrap justify-center">
          {node.children.map((child) => renderNode(child, level + 1))}
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full overflow-auto bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">组织架构图</h2>
      <div className="flex flex-wrap justify-center">{orgTree.map((node) => renderNode(node))}</div>
    </div>
  )
}
