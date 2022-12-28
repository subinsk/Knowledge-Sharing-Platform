import { useAuth } from "../contexts/auth";
import useSWR, { mutate } from 'swr'
import { api } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
import { Column, useTable } from 'react-table'
import Head from 'next/head'
import { AddNoteModal } from '../components/Notes/AddNoteModal'
import { BsPlus } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { getNotes } from "../services/db/getNotes";

interface ColumnData {
    sno: string;
    title: string;
    subjectCode: string;
    subject: string;
    url: string;
    class: string;
    batch: string;
    branch: string;
}

export default function Notes() {
    //? states
    const [showAddNoteModal, setShowAddNoteModal] = useState(false)
    const [notes, setNotes] = useState([])

    const { user, loading }: any = useAuth();
    // const { data: { data: pages } = {}, isValidating } = useSWR(loading ? false : '/pages', api.get)
    const columns = useMemo<Column<ColumnData>[]>(
        () => [
            {
                Header: 'S.No.',
                accessor: 'sno',
            },
            {
                Header: 'Title',
                accessor: 'title',
            },
            {
                Header: 'Subject Code',
                accessor: 'subjectCode',
            },
            {
                Header: 'Subject',
                accessor: 'subject',
            },
            {
                Header: 'URL',
                accessor: 'url',
            },
            {
                Header: 'Class',
                accessor: 'class',
            },
            {
                Header: 'Batch',
                accessor: 'batch',
            },
            {
                Header: 'Branch',
                accessor: 'branch',
            },
        ],
        []
    )
    const data = useMemo(
        () => notes.map((note: any) => {
            return {
                sno: `${note.id}.`,
                title: note.title,
                subjectCode: note.subject,
                subject: note.subjects.name,
                url: note.url,
                class: note.class,
                batch: note.batch,
                branch: note.branch
            }
        }),
        [notes]
    )


    const tableInstance = useTable({ columns, data })
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    //? effects
    useEffect(() => {
        getNotes()
            .then(res => setNotes(res))
    }, [])
    return (
        <div className="w-full bg-bg-primary flex flex-col">
            <AddNoteModal showAddNoteModal={showAddNoteModal} setShowAddNoteModal={setShowAddNoteModal} />
            <Head>
                <title>Notes</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="grid grid-cols-5 gap-0 justify-center py-48 px-14 space-y-8">
                <div
                    className="col-span-5 flex flex-row items-center justify-between">
                    <h3 className="font-bold text-4xl">Notes</h3>
                    <button
                        onClick={() => {
                            if (user)
                                setShowAddNoteModal(true)
                            else toast("Please login to add new notes", {
                                icon: 'ℹ️'
                            })
                        }}
                        type="button" className="flex items-center space-x-2 p-2 duration-200 transition-all rounded-md shadow-md hover:shadow-xl bg-primary text-white font-semibold">
                        <BsPlus className="h-9 w-9" />
                        <span className="text-lg">
                            Add Notes
                        </span>
                    </button>
                </div>
                <table className="col-span-5" {...getTableProps()}>
                    <thead>
                        {
                            headerGroups.map((headerGroup, index) => {
                                const { key: headerGroupPropsKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                                return (
                                    <tr className="" key={headerGroupPropsKey} {...restHeaderGroupProps}>
                                        {
                                            headerGroup.headers.map(column => {
                                                const { key: headerPropsKey, ...restHeaderProps } = column.getHeaderProps()
                                                return (
                                                    <th key={headerPropsKey} className="bg-primary border-primary border-2 text-white p-4" {...restHeaderProps}>
                                                        {
                                                            column.render('Header')}
                                                    </th>
                                                )
                                            })}
                                    </tr>
                                )
                            })
                        }
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {
                            rows.map(row => {
                                prepareRow(row)
                                const { key: rowPropsKey, ...restRowProps } = row.getRowProps()
                                return (
                                    <tr key={rowPropsKey} className="" {...restRowProps}>
                                        {
                                            row.cells.map(cell => {
                                                const { key: cellPropsKey, ...restCellProps } = cell.getCellProps()
                                                return (
                                                    <td key={cellPropsKey} className="text-center p-3 border-2 border-gray-800" {...restCellProps}>
                                                        {
                                                            cell.render('Cell')
                                                        }
                                                    </td>
                                                )
                                            })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}